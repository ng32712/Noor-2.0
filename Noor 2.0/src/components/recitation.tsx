import { useEffect, useRef, useState, type MutableRefObject } from "react";
import {
  RecitationSession, speechRecognitionSupported, type SessionSnapshot, type WordState,
} from "../lib/speech";
import { Btn, Icon, Modal, Pill } from "./ui";

/* ---------------- session hook ---------------- */

export function useRecitation(words: string[], onDone?: (s: SessionSnapshot) => void) {
  const key = words.filter(Boolean).join(" ");
  const [snap, setSnap] = useState<SessionSnapshot | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const sessionRef = useRef<RecitationSession | null>(null);
  if (!sessionRef.current || sessionRef.current.key !== key) {
    sessionRef.current?.dispose();
    sessionRef.current = new RecitationSession(key.split(" ").filter(Boolean));
    sessionRef.current.key = key;
  }
  const doneForAttempt = useRef(-1);

  useEffect(() => {
    const session = sessionRef.current;
    if (!session) return;
    doneForAttempt.current = -1;
    const unsub = session.subscribe((s) => {
      setSnap(s);
      if (s.phase === "done" && doneForAttempt.current !== s.attempt) {
        doneForAttempt.current = s.attempt;
        onDoneRef.current?.(s);
      }
    });
    return () => {
      unsub();
      session.dispose();
    };
  }, [key]);

  useEffect(() => () => sessionRef.current?.dispose(), []);

  return {
    snap,
    levelRef: sessionRef.current.mic.level,
    start: () => sessionRef.current?.start(),
    stop: () => sessionRef.current?.stop(),
    retry: () => sessionRef.current?.retry(),
  };
}

/* ---------------- audio visualizer (REAL analyser data) ---------------- */

export function AudioVisualizer({ level, active, className = "h-16" }: { level: MutableRefObject<number>; active: boolean; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const BARS = 56;
    const hist = new Array<number>(BARS).fill(0);
    let raf = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      hist.shift();
      const target = activeRef.current ? level.current : 0;
      hist.push(target);
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const bw = w / BARS;
      for (let i = 0; i < BARS; i++) {
        const v = hist[i];
        const bh = Math.max(3 * dpr, v * h * 0.92);
        const x = i * bw + bw * 0.18;
        const y = (h - bh) / 2;
        ctx.fillStyle = v > 0.42 ? "var(--color-burg)" : v > 0.12 ? "var(--color-forest)" : "rgba(16,27,21,0.28)";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, bw * 0.64, bh, 3 * dpr);
        else ctx.rect(x, y, bw * 0.64, bh);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [level]);

  return <canvas ref={canvasRef} className={`w-full ${className}`} aria-hidden="true" />;
}

/* ---------------- word track ---------------- */

const CHIP: Record<WordState, string> = {
  locked: "border-dashed border-ink/25 bg-cream/70 text-ink/45",
  current: "word-current border-ink",
  matched: "word-ok border-ink",
  uncertain: "bg-sun border-2 border-dashed border-burg",
  missed: "word-review border-ink",
};

export function WordTrack({ words, states, hidden = false, revealMistakes = false, size = "text-2xl sm:text-3xl" }: { words: string[]; states: WordState[]; hidden?: boolean; revealMistakes?: boolean; size?: string }) {
  return (
    <p dir="rtl" lang="ar" className={`font-quran text-right leading-[2.5] ${size}`}>
      {words.map((w, i) => {
        const st = states[i] ?? "locked";
        const mask = hidden && !(revealMistakes && (st === "missed" || st === "uncertain"));
        if (mask)
          return (
            <span key={i} className="inline-block mx-1 align-middle">
              <span className="inline-block h-[0.85em] w-[3.4ch] bg-ink/8 rounded-xl border-2 border-dashed border-ink/25" />
            </span>
          );
        return (
          <span key={i} className={`word-chip inline-block px-1.5 mx-0.5 rounded-xl border-2 ${CHIP[st]}`}>
            {w}
            {st === "uncertain" && <span className="text-[0.5em] align-middle mr-1">؟</span>}
          </span>
        );
      })}
    </p>
  );
}

export function WordTrackLegend() {
  const items: [string, string, string][] = [
    ["matched", "Recognized", "bg-sun border-ink"],
    ["current", "Your turn", "bg-lav border-ink"],
    ["uncertain", "Check this word", "bg-sun border-dashed border-burg"],
    ["missed", "Not recognized", "bg-blush border-ink"],
  ];
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-bold uppercase tracking-wider text-ink/60">
      {items.map(([k, label, cls]) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          <span className={`w-3.5 h-3.5 rounded border-2 ${cls}`} /> {label}
        </span>
      ))}
    </div>
  );
}

/* ---------------- mic status pill ---------------- */

export function MicStatus({ phase, error }: { phase: string; error: string | null }) {
  if (error)
    return (
      <Pill className="bg-blush">
        <Icon name="x" className="w-3.5 h-3.5" /> {error}
      </Pill>
    );
  switch (phase) {
    case "permission":
      return (
        <Pill className="bg-sun">
          <Icon name="mic" className="w-3.5 h-3.5" /> Allow microphone access to begin
        </Pill>
      );
    case "listening":
      return (
        <Pill className="bg-blush">
          <span className="w-2.5 h-2.5 rounded-full bg-burg animate-pulse" /> Listening…
        </Pill>
      );
    case "processing":
      return (
        <Pill className="bg-lav">
          <Icon name="clock" className="w-3.5 h-3.5 animate-spin" /> Checking your recitation…
        </Pill>
      );
    case "done":
      return (
        <Pill className="bg-sun">
          <Icon name="check" className="w-3.5 h-3.5" /> Recitation complete
        </Pill>
      );
    default:
      return (
        <Pill className="bg-cream">
          <Icon name="mic" className="w-3.5 h-3.5" /> Ready
        </Pill>
      );
  }
}

/* ---------------- error card ---------------- */

const ERROR_COPY: Record<string, { title: string; body: string }> = {
  "mic-denied": {
    title: "Microphone access was denied",
    body: "Enable microphone permission for this site in your browser settings (the lock icon in the address bar), then try again.",
  },
  "no-mic": {
    title: "No microphone found",
    body: "Connect a microphone or check your device's input settings, then try again.",
  },
  unsupported: {
    title: "Arabic speech recognition isn't available in this browser",
    body: "Try Chrome or Edge on desktop or Android for live recognition — or use the honest self-check mode below.",
  },
  "no-speech": {
    title: "We couldn't hear a recitation",
    body: "Try speaking a little louder, closer to your microphone, then try again.",
  },
  network: {
    title: "Speech recognition is temporarily unavailable",
    body: "Recognition needs a connection right now. Check your network and try again.",
  },
  interrupted: {
    title: "Recitation recognition stopped unexpectedly",
    body: "That can happen when the tab loses focus. Give it another try.",
  },
};

export function ErrorCard({ kind, onRetry, onSelfCheck }: { kind: string; onRetry: () => void; onSelfCheck?: () => void }) {
  const copy = ERROR_COPY[kind] ?? ERROR_COPY.interrupted;
  return (
    <div className="card-pop bg-paper rounded-[1.6rem] p-7">
      <div className="flex items-start gap-4">
        <span className="w-11 h-11 shrink-0 rounded-2xl bg-blush border-2 border-ink grid place-items-center">
          <Icon name="mic" className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-display text-2xl uppercase">{copy.title}</h3>
          <p className="text-sm text-ink/65 mt-2 leading-relaxed">{copy.body}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-5">
        <Btn variant="ink" onClick={onRetry}>
          <Icon name="refresh" className="w-4 h-4" /> Try again
        </Btn>
        {onSelfCheck && (
          <Btn variant="cream" onClick={onSelfCheck}>
            <Icon name="check" className="w-4 h-4" /> Self-check mode
          </Btn>
        )}
      </div>
    </div>
  );
}

/* ---------------- word drill (difficult word practice) ---------------- */

export function WordDrill({ word, onClose, onResult, playAyah }: { word: string; onClose: (ok: boolean) => void; onResult: (ok: boolean) => void; playAyah?: () => void }) {
  const { snap, start, stop, retry, levelRef } = useRecitation([word]);
  const doneFor = useRef(-1);
  const ok = !!snap && snap.phase === "done" && snap.matched + snap.uncertain === 1;
  useEffect(() => {
    if (snap?.phase === "done" && doneFor.current !== snap.attempt) {
      doneFor.current = snap.attempt;
      onResult(snap.matched + snap.uncertain === 1);
    }
  }, [snap, onResult]);

  const hear = () => {
    try {
      const u = new SpeechSynthesisUtterance(word);
      u.lang = "ar-SA";
      u.rate = 0.85;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch {
      /* synthesis unavailable */
    }
  };

  return (
    <Modal open onClose={() => onClose(ok)} title="Practice this word">
      <div className="text-center">
        <p dir="rtl" lang="ar" className="font-quran text-5xl py-4">
          {word}
        </p>
        {snap?.phase === "done" && (
          <p className={`inline-flex items-center gap-2 border-2 border-ink rounded-full px-5 py-2 font-bold uppercase tracking-widest text-sm ${ok ? "bg-sun" : "bg-blush"}`}>
            <Icon name={ok ? "check" : "x"} className="w-4 h-4" /> {ok ? "Word recognized" : "Not recognized yet"}
          </p>
        )}
        {snap?.phase === "listening" && (
          <div className="border-2 border-ink rounded-2xl bg-cream px-4 py-3">
            <AudioVisualizer level={levelRef} active className="h-10" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink/50 text-center mt-1">Listening… speak the word</p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2.5 mt-6">
        <Btn variant="cream" onClick={hear}>
          <Icon name="headphones" className="w-4 h-4" /> Hear word
        </Btn>
        {playAyah && (
          <Btn variant="cream" onClick={playAyah}>
            <Icon name="play" className="w-4 h-4" /> In ayah
          </Btn>
        )}
        {snap?.phase === "listening" ? (
          <Btn variant="burg" onClick={stop}>
            <Icon name="pause" className="w-4 h-4" /> Stop
          </Btn>
        ) : (
          <Btn
            variant="ink"
            onClick={() => {
              retry();
              start();
            }}
          >
            <Icon name="mic" className="w-4 h-4" /> {snap?.phase === "done" ? "Recite again" : "Recite it"}
          </Btn>
        )}
      </div>
      <div className="flex justify-center mt-5">
        <Btn variant="ghost" onClick={() => onClose(ok)}>
          {ok ? "Done — back to the ayah" : "Close"}
        </Btn>
      </div>
      <p className="text-[11px] text-ink/45 text-center mt-3">“Hear word” uses your device's synthesized Arabic voice as a pronunciation aid.</p>
    </Modal>
  );
}

/* ---------------- main recitation practice flow ---------------- */

export interface AttemptResult {
  states: WordState[];
  matched: number;
  uncertain: number;
  missed: number;
  total: number;
  elapsedMs: number;
  selfAssessed?: boolean;
}

export function RecitationPractice({
  words,
  hidden = false,
  onSaved,
  onNext,
  nextLabel = "Continue",
  playAyah,
  onWordDrill,
}: {
  words: string[];
  hidden?: boolean;
  onSaved: (r: AttemptResult) => void;
  onNext: () => void;
  nextLabel?: string;
  playAyah?: () => void;
  onWordDrill?: (word: string, ok: boolean) => void;
}) {
  const key = words.join(" ");
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [reveal, setReveal] = useState<"none" | "mistakes" | "full">("none");
  const [drillIdx, setDrillIdx] = useState<number | null>(null);
  const [selfCheck, setSelfCheck] = useState(false);
  const [preview, setPreview] = useState(!hidden);
  const supported = speechRecognitionSupported();

  useEffect(() => {
    setResult(null);
    setReveal("none");
    setDrillIdx(null);
    setSelfCheck(false);
    setPreview(!hidden);
  }, [key, hidden]);

  const handleDone = (s: SessionSnapshot) => {
    const r: AttemptResult = {
      states: s.states,
      matched: s.matched,
      uncertain: s.uncertain,
      missed: s.missed,
      total: s.total,
      elapsedMs: s.elapsedMs,
    };
    setResult(r);
    onSaved(r);
  };

  const { snap, start, stop, retry, levelRef } = useRecitation(words, handleDone);
  const phase = snap?.phase ?? "idle";
  const error = snap?.error ?? null;
  const recording = phase === "listening";
  const silent = !!result && result.matched === 0 && result.uncertain === 0;
  const hardWords = result ? result.states.map((st, i) => ({ st, i })).filter((x) => x.st === "uncertain" || x.st === "missed") : [];

  /* ---------- error ---------- */
  if (error) {
    return <ErrorCard kind={error.kind} onRetry={() => retry()} onSelfCheck={() => setSelfCheck(true)} />;
  }

  /* ---------- honest self-check fallback ---------- */
  if (selfCheck) {
    return (
      <SelfCheck
        words={words}
        onCancel={() => setSelfCheck(false)}
        onSubmit={(states) => {
          const matched = states.filter((s) => s === "matched").length;
          const r: AttemptResult = { states, matched, uncertain: 0, missed: states.length - matched, total: states.length, elapsedMs: 0, selfAssessed: true };
          setResult(r);
          onSaved(r);
          setSelfCheck(false);
        }}
      />
    );
  }

  /* ---------- result ---------- */
  if (result) {
    return (
      <div className="card-pop bg-paper rounded-[2rem] p-7 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MicStatus phase="done" error={null} />
          <span className="text-xs font-bold uppercase tracking-widest text-ink/50 flex items-center gap-1.5">
            <Icon name="check" className="w-3.5 h-3.5 text-forest-soft" /> Saved to your progress
          </span>
        </div>

        {silent ? (
          <div className="text-center py-8">
            <p className="font-display text-3xl uppercase">We couldn't hear a recitation</p>
            <p className="text-sm text-ink/60 mt-3 max-w-md mx-auto">Try speaking a little louder, closer to your microphone — then go again.</p>
          </div>
        ) : (
          <>
            {result.missed === 0 && result.matched > 0 && (
              <div className="mt-5 bg-sun border-2 border-ink rounded-2xl px-5 py-3 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-ink text-sun grid place-items-center shrink-0">
                  <Icon name="star" className="w-5 h-5" />
                </span>
                <p className="font-display text-2xl uppercase">Ayah complete</p>
              </div>
            )}
            <p className="font-display text-5xl sm:text-6xl uppercase leading-none mt-6">
              {result.matched + result.uncertain} <span className="text-ink/40">/ {result.total}</span>
            </p>
            <p className="font-bold uppercase tracking-widest text-sm text-ink/55 mt-2">words recognized</p>

            <div className="flex flex-wrap gap-2.5 mt-5">
              <span className="inline-flex items-center gap-2 border-2 border-ink rounded-full bg-sun px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-forest-soft" /> {result.matched} strong {result.matched === 1 ? "match" : "matches"}
              </span>
              {result.uncertain > 0 && (
                <span className="inline-flex items-center gap-2 border-2 border-dashed border-burg rounded-full bg-sun/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-burg" /> {result.uncertain} to check
                </span>
              )}
              {result.missed > 0 && (
                <span className="inline-flex items-center gap-2 border-2 border-ink rounded-full bg-blush px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-burg" /> {result.missed} missed
                </span>
              )}
              <span className="inline-flex items-center gap-2 border-2 border-ink/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink/60">
                <Icon name="clock" className="w-3.5 h-3.5" /> {Math.max(1, Math.round(result.elapsedMs / 1000))}s{result.selfAssessed ? " · self-assessed" : ""}
              </span>
            </div>

            <div className="mt-7 border-t-2 border-ink/10 pt-6">
              <WordTrack words={words} states={result.states} hidden={hidden && reveal === "none"} revealMistakes={reveal === "mistakes"} />
              <div className="mt-4">
                <WordTrackLegend />
              </div>
            </div>

            {hardWords.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-burg mb-2.5">Words that need practice</p>
                <div className="flex flex-wrap gap-2">
                  {hardWords.map(({ i }) => (
                    <button
                      key={i}
                      onClick={() => setDrillIdx(i)}
                      dir="rtl"
                      className="font-quran text-xl border-2 border-ink rounded-xl bg-cream px-4 py-1.5 hover:bg-blush hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      {words[i]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-8">
              <Btn variant="ink" onClick={() => { retry(); setResult(null); setReveal("none"); }}>
                <Icon name="refresh" className="w-4 h-4" /> Try again
              </Btn>
              {hidden && reveal !== "mistakes" && (
                <Btn variant="burg" onClick={() => setReveal("mistakes")}>
                  <Icon name="search" className="w-4 h-4" /> Review mistakes
                </Btn>
              )}
              {hidden && reveal !== "full" && (
                <Btn variant="sun" onClick={() => setReveal("full")}>
                  <Icon name="eye" className="w-4 h-4" /> Reveal ayah
                </Btn>
              )}
              <Btn variant="cream" onClick={onNext}>
                {nextLabel} <Icon name="arrowR" className="w-4 h-4" />
              </Btn>
            </div>
          </>
        )}

        {silent && (
          <div className="flex flex-wrap gap-3 mt-6">
            <Btn variant="ink" onClick={() => { retry(); setResult(null); }}>
              <Icon name="refresh" className="w-4 h-4" /> Try again
            </Btn>
            <Btn variant="cream" onClick={onNext}>
              {nextLabel} <Icon name="arrowR" className="w-4 h-4" />
            </Btn>
          </div>
        )}

        <p className="text-[11px] text-ink/45 mt-6 leading-relaxed">
          Speech recognition matched these words against the verified text — it measures recognition, not tajweed. For pronunciation guidance, learn with a qualified teacher.
        </p>

        {drillIdx !== null && (
          <WordDrill
            word={words[drillIdx]}
            onClose={() => setDrillIdx(null)}
            onResult={(ok) => onWordDrill?.(words[drillIdx], ok)}
            playAyah={playAyah}
          />
        )}
      </div>
    );
  }

  /* ---------- live: listening / processing ---------- */
  if (phase === "listening" || phase === "processing") {
    const live = snap;
    return (
      <div className={`card-pop rounded-[2rem] p-7 sm:p-9 bg-paper ${recording ? "recording" : ""}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MicStatus phase={phase} error={null} />
          <p className="font-display text-2xl">
            {live?.resolved ?? 0} <span className="text-ink/40">/ {words.length}</span>{" "}
            <span className="text-sm font-body font-bold uppercase tracking-widest text-ink/50">words recognized</span>
          </p>
        </div>
        <div className="mt-5 border-2 border-ink rounded-2xl bg-cream px-4 py-3">
          <AudioVisualizer level={levelRef} active={recording} className="h-16" />
        </div>
        <div className="mt-6">
          {hidden ? (
            <div className="border-2 border-dashed border-ink/30 rounded-2xl bg-cream/60 px-6 py-8 text-center">
              <p className="font-display text-2xl uppercase flex items-center justify-center gap-2">
                <Icon name="lock" className="w-5 h-5" /> Ayah hidden
              </p>
              <p className="text-sm text-ink/55 mt-1">Recite from memory — the tracker is still listening.</p>
            </div>
          ) : (
            live && <WordTrack words={words} states={live.states} />
          )}
          {recording && live?.interim && (
            <p dir="rtl" lang="ar" className="font-quran text-xl text-ink/40 text-right mt-4 min-h-[2rem]">
              {live.interim}…
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-7">
          {recording ? (
            <Btn variant="burg" onClick={stop}>
              <Icon name="pause" className="w-4 h-4" /> Stop
            </Btn>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink/55">
              <Icon name="clock" className="w-4 h-4 animate-spin" /> Checking your recitation…
            </span>
          )}
          {hidden && live && (
            <span className="text-sm font-bold text-ink/55">
              {live.resolved} / {words.length} so far — keep going
            </span>
          )}
        </div>
        <p className="text-[11px] text-ink/45 mt-4">
          Your voice is processed temporarily for recognition and discarded — nothing is recorded or stored.
        </p>
      </div>
    );
  }

  /* ---------- ready / permission ---------- */
  return (
    <div className="card-pop bg-paper rounded-[2rem] p-7 sm:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MicStatus phase={phase} error={null} />
        {!supported && (
          <button onClick={() => setSelfCheck(true)} className="text-xs font-bold uppercase tracking-widest text-burg underline underline-offset-4 cursor-pointer">
            Recognition unavailable — self-check mode
          </button>
        )}
      </div>

      {hidden && !preview ? (
        <div className="mt-6 border-2 border-dashed border-ink/30 rounded-2xl bg-lav/40 px-6 py-9 text-center">
          <p className="font-display text-3xl uppercase flex items-center justify-center gap-3">
            <Icon name="lock" className="w-6 h-6" /> Ayah hidden
          </p>
          <p className="text-sm text-ink/60 mt-2">Recite the ayah from memory. The tracker compares your voice to the verified text without showing it.</p>
          <button onClick={() => setPreview(true)} className="mt-4 text-xs font-bold uppercase tracking-widest text-ink/55 underline underline-offset-4 cursor-pointer">
            Peek at the ayah first
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <WordTrack words={words} states={words.map(() => "locked" as WordState)} />
          <div className="mt-4">
            <WordTrackLegend />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-9">
        <button
          onClick={() => {
            setPreview(false);
            start();
          }}
          className="group inline-flex items-center gap-3 bg-burg text-cream border-2 border-ink rounded-full pl-5 pr-7 py-4 font-display text-2xl uppercase shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
        >
          <span className="w-11 h-11 rounded-full bg-cream text-burg border-2 border-ink grid place-items-center group-hover:scale-110 transition-transform">
            <Icon name="mic" className="w-6 h-6" />
          </span>
          Start reciting
        </button>
        {playAyah && (
          <Btn variant="cream" onClick={playAyah}>
            <Icon name="play" className="w-4 h-4" /> Hear it first
          </Btn>
        )}
      </div>
      <p className="text-xs text-ink/50 mt-5 leading-relaxed max-w-xl">
        Pressing start asks your browser for microphone permission — nothing is captured until you allow it. Audio is processed temporarily for recognition and
        discarded; only your learning statistics are saved.
      </p>
    </div>
  );
}

/* ---------------- self-check fallback ---------------- */

export function SelfCheck({ words, onSubmit, onCancel }: { words: string[]; onSubmit: (states: WordState[]) => void; onCancel: () => void }) {
  const [marks, setMarks] = useState<("ok" | "review" | null)[]>(words.map(() => null));
  return (
    <div className="card-pop bg-paper rounded-[1.6rem] p-7">
      <Pill className="bg-lav">
        <Icon name="shield" className="w-3.5 h-3.5" /> Honest self-check
      </Pill>
      <p className="text-sm text-ink/65 mt-3 leading-relaxed">
        Recitation recognition isn't available here, so mark each word yourself after reciting aloud. This is recorded as a self-assessed attempt — never as speech recognition.
      </p>
      <div dir="rtl" className="mt-5 space-y-2">
        {words.map((w, i) => (
          <div key={i} className="flex items-center justify-between gap-3 border-2 border-ink/15 rounded-xl px-4 py-2.5 bg-cream">
            <span className="font-quran text-2xl">{w}</span>
            <div className="flex gap-2" dir="ltr">
              <button
                onClick={() => setMarks((m) => m.map((x, j) => (j === i ? "ok" : x)))}
                className={`w-9 h-9 rounded-lg border-2 border-ink grid place-items-center cursor-pointer transition-all ${marks[i] === "ok" ? "bg-sun" : "bg-paper hover:bg-sun/50"}`}
                aria-label={`Recognized ${w}`}
              >
                <Icon name="check" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMarks((m) => m.map((x, j) => (j === i ? "review" : x)))}
                className={`w-9 h-9 rounded-lg border-2 border-ink grid place-items-center cursor-pointer transition-all ${marks[i] === "review" ? "bg-blush" : "bg-paper hover:bg-blush/60"}`}
                aria-label={`Needs review ${w}`}
              >
                <Icon name="x" className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-6">
        <Btn variant="ink" disabled={marks.some((m) => m === null)} onClick={() => onSubmit(marks.map((m) => (m === "ok" ? "matched" : "missed")))}>
          <Icon name="check" className="w-4 h-4" /> Save attempt
        </Btn>
        <Btn variant="ghost" onClick={onCancel}>
          Cancel
        </Btn>
      </div>
    </div>
  );
}
