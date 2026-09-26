/* ============================================================
   NOOR — REAL-TIME RECITATION ENGINE
   Framework-agnostic speech pipeline:

     Microphone → Arabic Speech Recognition → interim/final
     transcript → Arabic normalization (comparison ONLY — the
     verified dataset is never modified) → tokenization →
     sequential word matching → live state snapshots.

   The recognizer is behind a SpeechRecognizer interface so a
   more accurate streaming Arabic STT provider can be plugged
   in later without touching the UI.
   ============================================================ */

export type WordState = "locked" | "current" | "matched" | "uncertain" | "missed";

export type SessionPhase = "idle" | "permission" | "listening" | "processing" | "done";

export type SessionErrorKind = "mic-denied" | "no-mic" | "unsupported" | "no-speech" | "network" | "interrupted";

export interface SessionError {
  kind: SessionErrorKind;
  detail?: string;
}

export interface SessionSnapshot {
  phase: SessionPhase;
  error: SessionError | null;
  states: WordState[];
  total: number;
  matched: number;
  uncertain: number;
  resolved: number; // matched + uncertain
  missed: number;
  complete: boolean;
  interim: string;
  transcript: string;
  elapsedMs: number;
  attempt: number;
}

/* ---------------- Arabic normalizer (speech comparison ONLY) ---------------- */

const TASHKEEL = /[\u064B-\u065F\u0670]/g;
const MARKS = /[\u0610-\u061A\u06D6-\u06ED\u0640\u0671]/g;
const HAMZA_ON_ALIF = /[\u0623\u0625\u0672]/g;
const HAMZA_ON_WAW = /\u0624/g;
const HAMZA_ON_YA = /\u0626/g;
const BARE_HAMZA = /\u0621/g;
const ALEF_MAKSURA = /\u0649/g;
const TATWEEL = /\u0640/g;
const AR_DIGITS = /[\u0660-\u0669]/g;

/** Normalize a speech-recognition artifact OR a verified word for comparison.
 *  Returns a NEW string — inputs (and the dataset) are never mutated. */
export function normalizeForMatching(input: string): string {
  return input
    .normalize("NFC")
    .replace(/[\u200B-\u200F\u2028-\u202F\uFEFF]/g, "")
    .replace(/[.,،؛:!?"'()\[\]{}«»\-–—]/g, " ")
    .replace(TASHKEEL, "")
    .replace(MARKS, "")
    .replace(TATWEEL, "")
    .replace(HAMZA_ON_ALIF, "\u0627")
    .replace(HAMZA_ON_WAW, "\u0648")
    .replace(HAMZA_ON_YA, "\u064A")
    .replace(BARE_HAMZA, "")
    .replace(ALEF_MAKSURA, "\u064A")
    .replace(AR_DIGITS, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const tokenize = (text: string): string[] => normalizeForMatching(text).split(" ").filter(Boolean);

/* ---------------- similarity ---------------- */

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

const similarity = (a: string, b: string): number => {
  const max = Math.max(a.length, b.length);
  return max === 0 ? 1 : 1 - levenshtein(a, b) / max;
};

const variantsOf = (word: string): string[] => {
  const base = normalizeForMatching(word);
  const set = new Set<string>();
  if (base) set.add(base);
  const noAlif = base.replace(/^\u0627+/, "");
  if (noAlif.length >= 2) set.add(noAlif);
  const yaTail = base.replace(/\u064A$/, "\u0649");
  if (yaTail !== base) set.add(yaTail);
  return Array.from(set);
};

/* ---------------- sequential word matcher ---------------- */

const MATCH_EXACT = 0.999;
const MATCH_TOLERANT = 0.7;
const WINDOW = 2; // how far ahead a recognized token may reach

export interface MatchResult {
  states: WordState[];
  pointer: number;
  matched: number;
  uncertain: number;
  missed: number;
}

export class WordMatcher {
  private variants: string[][];
  constructor(verifiedWords: string[]) {
    this.variants = verifiedWords.map(variantsOf);
  }
  get total(): number {
    return this.variants.length;
  }

  /** Live alignment — idempotent: recomputed from the whole transcript each time. */
  align(tokens: string[]): MatchResult {
    const n = this.variants.length;
    const states: WordState[] = new Array(n).fill("locked");
    let matched = 0, uncertain = 0;
    let pointer = 0;
    for (const tok of tokens) {
      if (pointer >= n) break;
      let bestIdx = -1, bestScore = 0;
      const limit = Math.min(n - 1, pointer + WINDOW);
      for (let i = pointer; i <= limit; i++) {
        for (const v of this.variants[i]) {
          const exact = v === tok || (v.length <= 2 && v === tok);
          const score = exact ? 1 : v.length <= 2 || tok.length <= 2 ? (v === tok ? 1 : 0) : similarity(v, tok);
          if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
          }
        }
      }
      if (bestIdx >= 0 && bestScore >= MATCH_EXACT) {
        states[bestIdx] = "matched";
        matched++;
        pointer = bestIdx + 1;
      } else if (bestIdx >= 0 && bestScore >= MATCH_TOLERANT) {
        states[bestIdx] = "uncertain";
        uncertain++;
        pointer = bestIdx + 1;
      }
      // lower scores: treat as STT noise / extra speech — do not penalize yet
    }
    if (pointer < n) states[pointer] = "current";
    return { states, pointer, matched, uncertain, missed: 0 };
  }

  /** Final verdict — anything never reached counts as missed. */
  finalize(tokens: string[]): MatchResult {
    const r = this.align(tokens);
    let missed = 0;
    for (let i = r.pointer; i < this.variants.length; i++) {
      r.states[i] = "missed";
      missed++;
    }
    return { ...r, missed };
  }
}

/* ---------------- microphone controller ---------------- */

export class MicrophoneController {
  private stream: MediaStream | null = null;
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private raf = 0;
  /** Live 0..1 input level, written every animation frame while acquired. */
  readonly level: { current: number } = { current: 0 };

  static async permissionState(): Promise<"granted" | "denied" | "prompt" | "unknown"> {
    try {
      if (navigator.permissions && "query" in navigator.permissions) {
        const p = await navigator.permissions.query({ name: "microphone" as PermissionName });
        return p.state as "granted" | "denied" | "prompt";
      }
    } catch {
      /* fall through */
    }
    return "unknown";
  }

  /** Requests microphone access (the browser shows its own prompt) and
   *  starts feeding real analyser data into `this.level`. */
  async acquire(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) throw Object.assign(new Error("no-media"), { name: "NotFoundError" });
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const AC: typeof AudioContext = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    if (this.ctx.state === "suspended") await this.ctx.resume().catch(() => {});
    const source = this.ctx.createMediaStreamSource(this.stream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.55;
    source.connect(this.analyser);
    const bins = new Uint8Array(this.analyser.frequencyBinCount);
    const loop = () => {
      if (!this.analyser) return;
      this.analyser.getByteFrequencyData(bins);
      let sum = 0;
      for (let i = 0; i < bins.length; i++) sum += bins[i];
      this.level.current = Math.min(1, (sum / bins.length / 255) * 1.9);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  release(): void {
    cancelAnimationFrame(this.raf);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.analyser = null;
    this.level.current = 0;
  }
}

/* ---------------- speech recognition service ---------------- */

export interface RecognitionEvents {
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (err: SessionError) => void;
  onEnd: () => void;
}

export interface SpeechRecognizer {
  start(): void;
  stop(): void;
  abort(): void;
}

export function speechRecognitionSupported(): boolean {
  const w = window as unknown as Record<string, unknown>;
  return typeof (w.SpeechRecognition ?? w.webkitSpeechRecognition) === "function";
}

type RawRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function createRaw(): RawRecognition | null {
  const w = window as unknown as Record<string, new () => RawRecognition>;
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

/** Browser Web-Speech recognizer configured for Arabic, with continuous +
 *  interim results. Transient `no-speech` pauses restart silently while the
 *  session is active; hard errors are surfaced. Swap this class for a
 *  streaming STT provider later — the interface stays the same. */
export class BrowserArabicRecognizer implements SpeechRecognizer {
  private rec: RawRecognition | null = null;
  private active = false;
  private stoppedByUser = false;
  private silentRestarts = 0;
  private gotSpeech = false;

  constructor(private events: RecognitionEvents, private lang = "ar-SA") {}

  start(): void {
    this.active = true;
    this.stoppedByUser = false;
    this.silentRestarts = 0;
    this.spawn();
  }

  private spawn(): void {
    const rec = createRaw();
    if (!rec) {
      this.active = false;
      this.events.onError({ kind: "unsupported" });
      return;
    }
    this.rec = rec;
    rec.lang = this.lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const text = r[0]?.transcript ?? "";
        if (r.isFinal) {
          if (text.trim()) this.gotSpeech = true;
          this.events.onFinal(text);
        } else {
          interim += text;
        }
      }
      if (interim) this.events.onInterim(interim);
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech") {
        // silence while thinking — handled by the onend restart logic
        return;
      }
      this.active = false;
      this.events.onError(mapError(e.error));
    };
    rec.onend = () => {
      if (this.active && !this.stoppedByUser) {
        if (!this.gotSpeech && this.silentRestarts >= 3) {
          this.active = false;
          this.events.onError({ kind: "no-speech" });
          return;
        }
        this.silentRestarts += this.gotSpeech ? 0 : 1;
        try {
          this.spawn();
          this.rec?.start();
        } catch {
          /* restart race — next tick */
          setTimeout(() => {
            if (this.active) {
              this.spawn();
              this.rec?.start();
            }
          }, 120);
        }
        return;
      }
      this.events.onEnd();
    };
    try {
      rec.start();
    } catch {
      /* already started */
    }
  }

  stop(): void {
    this.stoppedByUser = true;
    this.active = false;
    try {
      this.rec?.stop();
    } catch {
      /* noop */
    }
    // guarantee onEnd fires even if the engine never does
    setTimeout(() => this.events.onEnd(), 900);
  }

  abort(): void {
    this.active = false;
    this.stoppedByUser = true;
    try {
      this.rec?.abort();
    } catch {
      /* noop */
    }
  }
}

function mapError(code: string): SessionError {
  switch (code) {
    case "not-allowed":
      return { kind: "mic-denied" };
    case "audio-capture":
      return { kind: "no-mic" };
    case "service-not-allowed":
    case "language-not-supported":
    case "bad-grammar":
      return { kind: "unsupported", detail: code };
    case "network":
      return { kind: "network" };
    case "aborted":
      return { kind: "interrupted" };
    default:
      return { kind: "interrupted", detail: code };
  }
}

/* ---------------- recitation session (orchestrator) ---------------- */

export class RecitationSession {
  /** Identity tag set by the React hook so sessions can be swapped per ayah. */
  key = "";
  readonly mic = new MicrophoneController();
  private matcher: WordMatcher;
  private recognizer: SpeechRecognizer;
  private listeners = new Set<(s: SessionSnapshot) => void>();
  private transcript = "";
  private interim = "";
  private phase: SessionPhase = "idle";
  private error: SessionError | null = null;
  private startedAt = 0;
  private elapsed = 0;
  private attempt = 0;
  private completeTimer: number | null = null;
  private tickTimer: number | null = null;
  private endGuard = false;
  private saved = false;
  onSaved: ((result: MatchResult & { transcript: string; elapsedMs: number; attempt: number }) => void) | null = null;

  constructor(verifiedWords: string[], lang = "ar-SA") {
    this.matcher = new WordMatcher(verifiedWords);
    this.recognizer = new BrowserArabicRecognizer({
      onInterim: (t) => {
        this.interim = t;
        this.recompute();
      },
      onFinal: (t) => {
        this.transcript += " " + t;
        this.interim = "";
        this.recompute();
      },
      onError: (err) => this.fail(err),
      onEnd: () => this.settle(),
    }, lang);
  }

  subscribe(fn: (s: SessionSnapshot) => void): () => void {
    this.listeners.add(fn);
    fn(this.snapshot());
    return () => this.listeners.delete(fn);
  }

  private snapshot(): SessionSnapshot {
    const live = this.matcher.align(tokenize(this.transcript + " " + this.interim));
    const resolved = live.matched + live.uncertain;
    return {
      phase: this.phase,
      error: this.error,
      states: live.states,
      total: this.matcher.total,
      matched: live.matched,
      uncertain: live.uncertain,
      resolved,
      missed: 0,
      complete: this.matcher.total > 0 && live.pointer >= this.matcher.total,
      interim: this.interim,
      transcript: this.transcript.trim(),
      elapsedMs: this.phase === "listening" ? Date.now() - this.startedAt : this.elapsed,
      attempt: this.attempt,
    };
  }

  private emit(): void {
    const snap = this.snapshot();
    this.listeners.forEach((l) => l(snap));
  }

  private recompute(): void {
    this.emit();
    const snap = this.snapshot();
    if (snap.complete && this.phase === "listening" && !this.completeTimer) {
      // confidently matched the final word — wrap up shortly
      this.completeTimer = window.setTimeout(() => {
        this.completeTimer = null;
        if (this.phase === "listening") this.stop();
      }, 900);
    }
  }

  /** Begin: request mic permission → acquire → start Arabic recognition. */
  async start(): Promise<void> {
    if (!speechRecognitionSupported()) {
      this.fail({ kind: "unsupported" });
      return;
    }
    this.error = null;
    this.saved = false;
    this.endGuard = false;
    this.transcript = "";
    this.interim = "";
    this.attempt += 1;
    this.elapsed = 0;
    this.phase = "permission"; // browser prompt shows now
    this.emit();
    try {
      await this.mic.acquire();
    } catch (e) {
      const name = (e as Error)?.name;
      this.fail({ kind: name === "NotAllowedError" || name === "SecurityError" ? "mic-denied" : name === "NotFoundError" ? "no-mic" : "interrupted" });
      return;
    }
    this.phase = "listening";
    this.startedAt = Date.now();
    this.tickTimer = window.setInterval(() => this.emit(), 400);
    this.emit();
    this.recognizer.start();
  }

  /** Stop listening → finalize the attempt. */
  stop(): void {
    if (this.phase !== "listening" && this.phase !== "permission") return;
    if (this.completeTimer) {
      clearTimeout(this.completeTimer);
      this.completeTimer = null;
    }
    this.phase = "processing";
    this.emit();
    this.recognizer.stop();
  }

  private settle(): void {
    if (this.endGuard || (this.phase !== "processing" && this.phase !== "listening")) return;
    this.endGuard = true;
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
    this.elapsed = Date.now() - this.startedAt;
    this.mic.release();
    const result = this.matcher.finalize(tokenize(this.transcript));
    this.phase = "done";
    // emit final states
    const snap: SessionSnapshot = {
      ...this.snapshot(),
      phase: "done",
      states: result.states,
      matched: result.matched,
      uncertain: result.uncertain,
      resolved: result.matched + result.uncertain,
      missed: result.missed,
      elapsedMs: this.elapsed,
    };
    this.listeners.forEach((l) => l(snap));
    if (!this.saved) {
      this.saved = true;
      this.onSaved?.({ ...result, transcript: this.transcript.trim(), elapsedMs: this.elapsed, attempt: this.attempt });
    }
  }

  private fail(err: SessionError): void {
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
    if (this.completeTimer) {
      clearTimeout(this.completeTimer);
      this.completeTimer = null;
    }
    this.recognizer.abort();
    this.mic.release();
    this.error = err;
    this.phase = "idle";
    this.emit();
  }

  /** Reset for another attempt (mic released; user starts again). */
  retry(): void {
    this.transcript = "";
    this.interim = "";
    this.error = null;
    this.elapsed = 0;
    this.endGuard = false;
    this.saved = false;
    this.phase = "idle";
    this.emit();
  }

  dispose(): void {
    this.recognizer.abort();
    this.mic.release();
    if (this.tickTimer) clearInterval(this.tickTimer);
    if (this.completeTimer) clearTimeout(this.completeTimer);
    this.listeners.clear();
  }
}
