/* ============================================================
   NOOR core engine — auth, per-user isolated data store,
   spaced-repetition review, Arabic word matching, speech,
   i18n and recitation audio. All data lives per-user and is
   persisted locally (offline-first); nothing is shared
   between accounts.
   ============================================================ */
import { useSyncExternalStore } from "react";
import { ayahKey, pad3 } from "../data/quran";

/* ---------------- types ---------------- */

export interface Avatar {
  color: string;
  glyph: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  passHash: string;
  salt: string;
  createdAt: number;
  avatar: Avatar;
}

export interface MemRecord {
  attempts: number;
  success: number;
  failed: number;
  strength: number; // 0..100
  lastPracticed?: number;
  lastSuccess?: number;
  due?: number;
}
export interface SessionRec {
  id: string;
  ts: number;
  s: number;
  a: number;
  mode: "practice" | "memorize" | "review" | "word";
  recognized: number;
  total: number;
  words: ("ok" | "review")[];
  /** Attempt duration in milliseconds (0 for self-assessed / word drills). */
  durationMs?: number;
  /** True when the learner marked words manually (no speech recognition). */
  selfAssessed?: boolean;
  completionStatus?: "complete" | "partial";
}
export interface NoteRec {
  id: string;
  s: number;
  a: number;
  text: string;
  created: number;
  updated: number;
}
export interface BookmarkRec {
  s: number;
  a: number;
  ts: number;
  collection?: string; // Custom collection name
}
export interface QuizRec {
  id: string;
  ts: number;
  lesson: string;
  correct: number;
  total: number;
}
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress?: number; // 0-100
  target?: number;
}
export interface Gamification {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  achievements: Achievement[];
  totalMinutesLearned: number;
  totalAyahsRead: number;
  totalAyahsMemorized: number;
}
export interface Settings {
  theme: "light" | "dark" | "system";
  lang: "en" | "rw" | "ar";
  arabicSize: number; // px
  reciter: string;
  speed: number;
  showTranslation: boolean;
  autoPlay: boolean;
}
export interface Goals {
  daily: number;
  weeklyMem: number;
  practice: number;
  targetSurah: number;
}
export interface UserData {
  lastRead: { s: number; a: number } | null;
  readKeys: string[];
  mem: Record<string, MemRecord>;
  sessions: SessionRec[];
  bookmarks: BookmarkRec[];
  notes: NoteRec[];
  quiz: QuizRec[];
  goals: Goals;
  settings: Settings;
  daily: Record<string, { read: string[]; practiced: string[] }>;
  diffWords: Record<string, number>;
  gamification: Gamification;
}

/* ---------------- storage helpers ---------------- */

const LS = {
  users: "noor.users.v1",
  session: "noor.session.v1",
  data: (uid: string) => `noor.data.v1.${uid}`,
  reset: "noor.reset.v1",
  lang: "noor.lang.v1",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / private mode — keep running in-memory */
  }
}

export const uid = (): string => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const todayKey = (ts = Date.now()): string => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/* ---------------- password hashing ---------------- */

async function hashPass(pass: string, salt: string): Promise<string> {
  const input = `${salt}::noor::${pass}`;
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    // non-secure context fallback (demo build only)
    let h = 5381;
    for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
    return `fb_${(h >>> 0).toString(16)}`;
  }
}

/* ---------------- defaults ---------------- */

const defaultSettings = (): Settings => ({
  theme: "light",
  lang: (read<string>(LS.lang, "en") as Settings["lang"]) || "en",
  arabicSize: 34,
  reciter: "Alafasy_128kbps",
  speed: 1,
  showTranslation: true,
  autoPlay: true,
});
const defaultGoals = (): Goals => ({ daily: 10, weeklyMem: 5, practice: 5, targetSurah: 1 });

const getDefaultAchievements = (): Achievement[] => [
  { id: "first_ayah", name: "First Ayah", description: "Read your first ayah", icon: "📖", progress: 0, target: 1 },
  { id: "first_surah", name: "First Surah", description: "Complete reading a surah", icon: "📚", progress: 0, target: 1 },
  { id: "streak_7", name: "7-Day Streak", description: "Maintain a 7-day learning streak", icon: "🔥", progress: 0, target: 7 },
  { id: "streak_30", name: "30-Day Streak", description: "Maintain a 30-day learning streak", icon: "⭐", progress: 0, target: 30 },
  { id: "memorize_10", name: "Memorize 10 Ayahs", description: "Memorize 10 ayahs", icon: "🧠", progress: 0, target: 10 },
  { id: "memorize_50", name: "Memorize 50 Ayahs", description: "Memorize 50 ayahs", icon: "💎", progress: 0, target: 50 },
  { id: "quiz_master", name: "Quiz Master", description: "Complete 10 quizzes with 80%+ accuracy", icon: "🎯", progress: 0, target: 10 },
  { id: "tajweed_beginner", name: "Tajweed Beginner", description: "Complete 3 tajweed lessons", icon: "✨", progress: 0, target: 3 },
];

const defaultGamification = (): Gamification => ({
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: "",
  achievements: getDefaultAchievements(),
  totalMinutesLearned: 0,
  totalAyahsRead: 0,
  totalAyahsMemorized: 0,
});
const emptyData = (): UserData => ({
  lastRead: null,
  readKeys: [],
  mem: {},
  sessions: [],
  bookmarks: [],
  notes: [],
  quiz: [],
  goals: defaultGoals(),
  settings: defaultSettings(),
  daily: {},
  diffWords: {},
  gamification: defaultGamification(),
});

/* ---------------- store ---------------- */

export interface AppState {
  user: User | null;
  data: UserData | null;
}

let state: AppState = { user: null, data: null };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}
function setState(next: AppState) {
  state = next;
  emit();
}

// restore session on boot
(function boot() {
  const sessionId = read<string | null>(LS.session, null);
  if (sessionId) {
    const users = read<User[]>(LS.users, []);
    const user = users.find((u) => u.id === sessionId);
    if (user) state = { user, data: read<UserData>(LS.data(user.id), emptyData()) };
  }
})();

export const subscribe = (l: () => void): (() => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const getState = (): AppState => state;

export function useApp(): AppState {
  return useSyncExternalStore(subscribe, getState);
}

function saveUserData(uidX: string, data: UserData) {
  write(LS.data(uidX), data);
}

function mutateData(fn: (d: UserData) => void) {
  if (!state.user || !state.data) return;
  const d = JSON.parse(JSON.stringify(state.data)) as UserData;
  fn(d);
  saveUserData(state.user.id, d);
  setState({ ...state, data: d });
}

/* ---------------- auth ---------------- */

const AVATAR_COLORS = ["bg-burg", "bg-lav-deep", "bg-sun-deep", "bg-blush-deep", "bg-forest-soft", "bg-sage"];

export async function register(name: string, email: string, pass: string): Promise<{ ok: boolean; error?: string }> {
  const users = read<User[]>(LS.users, []);
  const cleanEmail = email.trim().toLowerCase();
  if (!name.trim()) return { ok: false, error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return { ok: false, error: "Please enter a valid email address." };
  if (pass.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  if (users.some((u) => u.email === cleanEmail)) return { ok: false, error: "An account with this email already exists." };
  const salt = uid();
  const passHash = await hashPass(pass, salt);
  const user: User = {
    id: uid(),
    name: name.trim(),
    email: cleanEmail,
    passHash,
    salt,
    createdAt: Date.now(),
    avatar: { color: AVATAR_COLORS[users.length % AVATAR_COLORS.length], glyph: name.trim()[0]?.toUpperCase() || "N" },
  };
  users.push(user);
  write(LS.users, users);
  write(LS.session, user.id);
  setState({ user, data: read<UserData>(LS.data(user.id), emptyData()) });
  return { ok: true };
}

export async function login(email: string, pass: string): Promise<{ ok: boolean; error?: string }> {
  const users = read<User[]>(LS.users, []);
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user) return { ok: false, error: "No account found with this email." };
  const hash = await hashPass(pass, user.salt);
  if (hash !== user.passHash) return { ok: false, error: "Incorrect password. Please try again." };
  write(LS.session, user.id);
  setState({ user, data: read<UserData>(LS.data(user.id), emptyData()) });
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(LS.session);
  setState({ user: null, data: null });
}

export function requestReset(email: string): { ok: boolean; code?: string; error?: string } {
  const users = read<User[]>(LS.users, []);
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user) return { ok: false, error: "No account found with this email." };
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const resets = read<Record<string, { code: string; exp: number }>>(LS.reset, {});
  resets[user.email] = { code, exp: Date.now() + 15 * 60 * 1000 };
  write(LS.reset, resets);
  return { ok: true, code };
}

export async function doReset(email: string, code: string, newPass: string): Promise<{ ok: boolean; error?: string }> {
  const resets = read<Record<string, { code: string; exp: number }>>(LS.reset, {});
  const clean = email.trim().toLowerCase();
  const rec = resets[clean];
  if (!rec || rec.code !== code.trim()) return { ok: false, error: "That code doesn't match. Check the 6-digit code." };
  if (Date.now() > rec.exp) return { ok: false, error: "That code has expired. Request a new one." };
  if (newPass.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  const users = read<User[]>(LS.users, []);
  const user = users.find((u) => u.email === clean);
  if (!user) return { ok: false, error: "No account found." };
  user.salt = uid();
  user.passHash = await hashPass(newPass, user.salt);
  write(LS.users, users);
  delete resets[clean];
  write(LS.reset, resets);
  return { ok: true };
}

export async function changePassword(current: string, next: string): Promise<{ ok: boolean; error?: string }> {
  if (!state.user) return { ok: false, error: "Not signed in." };
  const hash = await hashPass(current, state.user.salt);
  if (hash !== state.user.passHash) return { ok: false, error: "Current password is incorrect." };
  if (next.length < 6) return { ok: false, error: "New password must be at least 6 characters." };
  const users = read<User[]>(LS.users, []);
  const user = users.find((u) => u.id === state.user!.id)!;
  user.salt = uid();
  user.passHash = await hashPass(next, user.salt);
  write(LS.users, users);
  setState({ ...state, user: { ...user } });
  return { ok: true };
}

export function deleteAccount() {
  if (!state.user) return;
  const users = read<User[]>(LS.users, []).filter((u) => u.id !== state.user!.id);
  write(LS.users, users);
  localStorage.removeItem(LS.data(state.user.id));
  localStorage.removeItem(LS.session);
  setState({ user: null, data: null });
}

export function patchProfile(patch: Partial<Pick<User, "name">> & { avatar?: Partial<Avatar> }) {
  if (!state.user) return;
  const users = read<User[]>(LS.users, []);
  const user = users.find((u) => u.id === state.user!.id)!;
  if (patch.name !== undefined) user.name = patch.name;
  if (patch.avatar) user.avatar = { ...user.avatar, ...patch.avatar };
  write(LS.users, users);
  setState({ ...state, user: { ...user } });
}

/* ---------------- data actions ---------------- */

export const patchSettings = (patch: Partial<Settings>) => mutateData((d) => Object.assign(d.settings, patch));
export const patchGoals = (patch: Partial<Goals>) => mutateData((d) => Object.assign(d.goals, patch));

export function setLastRead(s: number, a: number) {
  mutateData((d) => {
    d.lastRead = { s, a };
  });
}

export function markAyahRead(s: number, a: number) {
  mutateData((d) => {
    const key = ayahKey(s, a);
    if (!d.readKeys.includes(key)) d.readKeys.push(key);
    const tk = todayKey();
    d.daily[tk] = d.daily[tk] || { read: [], practiced: [] };
    if (!d.daily[tk].read.includes(key)) d.daily[tk].read.push(key);
    d.lastRead = { s, a };
    
    // Update gamification
    updateGamification(d, 0);
  });
}

export function isBookmarked(s: number, a: number): boolean {
  return !!state.data?.bookmarks.some((b) => b.s === s && b.a === a);
}

export function toggleBookmark(s: number, a: number) {
  mutateData((d) => {
    const i = d.bookmarks.findIndex((b) => b.s === s && b.a === a);
    if (i >= 0) d.bookmarks.splice(i, 1);
    else d.bookmarks.unshift({ s, a, ts: Date.now() });
  });
}

export function upsertNote(s: number, a: number, text: string) {
  mutateData((d) => {
    const existing = d.notes.find((n) => n.s === s && n.a === a);
    if (existing) {
      existing.text = text;
      existing.updated = Date.now();
    } else {
      d.notes.unshift({ id: uid(), s, a, text, created: Date.now(), updated: Date.now() });
    }
  });
}
export function deleteNote(id: string) {
  mutateData((d) => {
    d.notes = d.notes.filter((n) => n.id !== id);
  });
}

export function recordQuiz(lesson: string, correct: number, total: number) {
  mutateData((d) => {
    d.quiz.unshift({ id: uid(), ts: Date.now(), lesson, correct, total });
    if (d.quiz.length > 100) d.quiz.length = 100;
    
    // Award XP based on quiz performance
    const accuracy = total > 0 ? correct / total : 0;
    const xpGain = Math.round(20 * accuracy); // Up to 20 XP per quiz
    d.gamification.xp += xpGain;
    d.gamification.level = Math.floor(d.gamification.xp / 100) + 1;
    
    // Update streak
    updateGamification(d, 0);
  });
}

const DAY = 86400000;
const intervalDays = (strength: number): number =>
  strength < 40 ? 1 : strength < 60 ? 2 : strength < 80 ? 4 : strength < 95 ? 7 : 14;

/** Core learning event: a recitation attempt with per-word outcomes. */
export function recordPractice(opts: {
  s: number;
  a: number;
  mode: SessionRec["mode"];
  words: ("ok" | "review")[];
  rawWords?: string[];
  durationMs?: number;
  selfAssessed?: boolean;
  completionStatus?: "complete" | "partial";
}) {
  mutateData((d) => {
    const key = ayahKey(opts.s, opts.a);
    const total = opts.words.length;
    const recognized = opts.words.filter((w) => w === "ok").length;
    const ratio = total ? recognized / total : 0;
    const success = ratio >= 0.75;
    const rec: MemRecord = d.mem[key] || { attempts: 0, success: 0, failed: 0, strength: 0 };
    rec.attempts += 1;
    rec.lastPracticed = Date.now();
    if (success) {
      rec.success += 1;
      rec.lastSuccess = Date.now();
      rec.strength = Math.min(100, Math.round(rec.strength + 10 + ratio * 12));
      rec.due = Date.now() + intervalDays(rec.strength) * DAY;
    } else {
      rec.failed += 1;
      rec.strength = Math.max(0, rec.strength - 18);
      rec.due = Date.now() + DAY / 2;
    }
    d.mem[key] = rec;
    // difficult words
    if (opts.rawWords) {
      opts.words.forEach((w, i) => {
        if (w === "review" && opts.rawWords![i]) {
          const n = normalizeAr(opts.rawWords![i]);
          d.diffWords[n] = (d.diffWords[n] || 0) + 1;
        }
      });
    }
    // session log (learning statistics only — never raw audio)
    d.sessions.unshift({
      id: uid(),
      ts: Date.now(),
      s: opts.s,
      a: opts.a,
      mode: opts.mode,
      recognized,
      total,
      words: opts.words,
      durationMs: opts.durationMs ?? 0,
      selfAssessed: opts.selfAssessed,
      completionStatus: opts.completionStatus ?? (success ? "complete" : "partial"),
    });
    if (d.sessions.length > 250) d.sessions.length = 250;
    // daily stats
    const tk = todayKey();
    d.daily[tk] = d.daily[tk] || { read: [], practiced: [] };
    if (!d.daily[tk].practiced.includes(key)) d.daily[tk].practiced.push(key);
    
    // Update gamification
    updateGamification(d, opts.durationMs ?? 0);
  });
}

/* ---------------- gamification helpers ---------------- */

function updateGamification(d: UserData, durationMs: number) {
  const today = todayKey();
  const g = d.gamification;
  
  // Update streak
  if (g.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - DAY);
    const yesterdayKey = todayKey(yesterday.getTime());
    
    if (g.lastActiveDate === yesterdayKey) {
      g.streak += 1;
      g.longestStreak = Math.max(g.longestStreak, g.streak);
    } else if (g.lastActiveDate !== today) {
      g.streak = 1;
    }
    g.lastActiveDate = today;
  }
  
  // Add XP for practice
  const xpGain = Math.round(10 + (durationMs / 60000) * 2); // 10 XP base + 2 XP per minute
  g.xp += xpGain;
  
  // Update level (every 100 XP = 1 level)
  g.level = Math.floor(g.xp / 100) + 1;
  
  // Update total minutes
  g.totalMinutesLearned += Math.round(durationMs / 60000);
  
  // Update total ayahs read
  g.totalAyahsRead = d.readKeys.length;
  
  // Update total ayahs memorized
  g.totalAyahsMemorized = Object.values(d.mem).filter(m => m.strength >= 80).length;
  
  // Check and update achievements
  updateAchievements(d);
}

function updateAchievements(d: UserData) {
  const g = d.gamification;
  const now = Date.now();
  
  g.achievements.forEach(ach => {
    if (ach.unlockedAt) return; // Already unlocked
    
    switch (ach.id) {
      case "first_ayah":
        ach.progress = Math.min(100, (d.readKeys.length / ach.target!) * 100);
        if (d.readKeys.length >= ach.target!) {
          ach.unlockedAt = now;
          ach.progress = 100;
        }
        break;
      case "first_surah":
        // Check if any surah is fully read
        const surahsRead = new Set(d.readKeys.map(k => parseInt(k.split(":")[0])));
        ach.progress = Math.min(100, (surahsRead.size / ach.target!) * 100);
        if (surahsRead.size >= ach.target!) {
          ach.unlockedAt = now;
          ach.progress = 100;
        }
        break;
      case "streak_7":
        ach.progress = Math.min(100, (g.streak / ach.target!) * 100);
        if (g.streak >= ach.target!) {
          ach.unlockedAt = now;
          ach.progress = 100;
        }
        break;
      case "streak_30":
        ach.progress = Math.min(100, (g.streak / ach.target!) * 100);
        if (g.streak >= ach.target!) {
          ach.unlockedAt = now;
          ach.progress = 100;
        }
        break;
      case "memorize_10":
        ach.progress = Math.min(100, (g.totalAyahsMemorized / ach.target!) * 100);
        if (g.totalAyahsMemorized >= ach.target!) {
          ach.unlockedAt = now;
          ach.progress = 100;
        }
        break;
      case "memorize_50":
        ach.progress = Math.min(100, (g.totalAyahsMemorized / ach.target!) * 100);
        if (g.totalAyahsMemorized >= ach.target!) {
          ach.unlockedAt = now;
          ach.progress = 100;
        }
        break;
      case "quiz_master":
        const highScoreQuizzes = d.quiz.filter(q => (q.correct / q.total) >= 0.8).length;
        ach.progress = Math.min(100, (highScoreQuizzes / ach.target!) * 100);
        if (highScoreQuizzes >= ach.target!) {
          ach.unlockedAt = now;
          ach.progress = 100;
        }
        break;
      case "tajweed_beginner":
        const tajweedLessons = d.quiz.filter(q => q.lesson.startsWith("tajweed_")).length;
        ach.progress = Math.min(100, (tajweedLessons / ach.target!) * 100);
        if (tajweedLessons >= ach.target!) {
          ach.unlockedAt = now;
          ach.progress = 100;
        }
        break;
    }
  });
}

export function addXP(amount: number) {
  mutateData((d) => {
    d.gamification.xp += amount;
    d.gamification.level = Math.floor(d.gamification.xp / 100) + 1;
  });
}

/* ---------------- derived stats ---------------- */

export function todayActivity(d: UserData | null): { read: number; practiced: number; goal: number } {
  if (!d) return { read: 0, practiced: 0, goal: 10 };
  const t = d.daily[todayKey()] || { read: [], practiced: [] };
  return { read: t.read.length, practiced: t.practiced.length, goal: d.goals.daily };
}

export function streak(d: UserData | null): number {
  if (!d) return 0;
  let count = 0;
  let cursor = Date.now();
  const active = (ts: number) => {
    const rec = d.daily[todayKey(ts)];
    return !!rec && rec.read.length + rec.practiced.length > 0;
  };
  if (!active(cursor)) cursor -= DAY; // today not started yet — keep yesterday's streak alive
  while (active(cursor)) {
    count++;
    cursor -= DAY;
  }
  return count;
}

export function memorizedCount(d: UserData | null): number {
  if (!d) return 0;
  return Object.values(d.mem).filter((m) => m.strength >= 80 && m.success > 0).length;
}

export interface QueueItem {
  s: number;
  a: number;
  rec: MemRecord;
}

export function reviewQueue(d: UserData | null): { attention: QueueItem[]; soon: QueueItem[]; strong: QueueItem[] } {
  const out = { attention: [] as QueueItem[], soon: [] as QueueItem[], strong: [] as QueueItem[] };
  if (!d) return out;
  const now = Date.now();
  Object.entries(d.mem).forEach(([key, rec]) => {
    if (rec.attempts === 0) return;
    const [s, a] = key.split(":").map(Number);
    const due = rec.due ?? now;
    if (due <= now) (rec.strength < 60 ? out.attention : out.soon).push({ s, a, rec });
    else if (due <= now + 3 * DAY) out.soon.push({ s, a, rec });
    else out.strong.push({ s, a, rec });
  });
  out.attention.sort((x, y) => (x.rec.due ?? 0) - (y.rec.due ?? 0));
  return out;
}

export function last7Days(d: UserData | null): { label: string; count: number }[] {
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const ts = Date.now() - i * DAY;
    const rec = d?.daily[todayKey(ts)];
    days.push({
      label: new Date(ts).toLocaleDateString("en", { weekday: "short" }).slice(0, 2),
      count: rec ? rec.read.length + rec.practiced.length : 0,
    });
  }
  return days;
}

/* ---------------- demo account seed ---------------- */

export function seedDemoData() {
  if (!state.user) return;
  const d = read<UserData>(LS.data(state.user.id), emptyData());
  if (d.sessions.length > 0) return; // already seeded
  const now = Date.now();
  const daysAgo = (n: number) => now - n * DAY;
  // realistic week of activity for a 7-day streak
  const plan: [string, string[]][] = [
    ["1:2", ["112:1"]],
    ["112:2", ["113:1"]],
    ["113:2", ["114:1"]],
    ["67:1", ["67:2"]],
    ["97:1", ["103:1"]],
    ["108:1", ["67:3"]],
    ["67:4", ["97:2"]],
  ];
  plan.forEach(([practiced, reads], i) => {
    const tk = todayKey(daysAgo(6 - i));
    d.daily[tk] = { read: reads, practiced: [practiced] };
  });
  const mk = (attempts: number, success: number, strength: number, dueIn: number, last: number): MemRecord => ({
    attempts,
    success,
    failed: attempts - success,
    strength,
    lastPracticed: last,
    lastSuccess: success ? last : undefined,
    due: now + dueIn * DAY,
  });
  d.mem = {
    "1:2": mk(9, 8, 92, 12, daysAgo(1)),
    "112:1": mk(7, 6, 85, 6, daysAgo(2)),
    "112:2": mk(6, 5, 81, 5, daysAgo(3)),
    "113:1": mk(5, 4, 74, 2, daysAgo(2)),
    "114:1": mk(4, 3, 68, 1, daysAgo(3)),
    "67:1": mk(4, 2, 41, -0.5, daysAgo(1)),
    "67:2": mk(3, 1, 33, -1, daysAgo(2)),
    "97:1": mk(3, 2, 55, 0.5, daysAgo(1)),
    "103:1": mk(2, 2, 62, 3, daysAgo(4)),
    "108:1": mk(2, 1, 48, 2, daysAgo(5)),
  };
  d.readKeys = ["1:1", "1:2", "1:3", "112:1", "112:2", "113:1", "114:1", "67:1", "97:1", "103:1"];
  d.sessions = [
    { id: uid(), ts: daysAgo(1), s: 67, a: 1, mode: "memorize", recognized: 6, total: 12, words: [] },
    { id: uid(), ts: daysAgo(1), s: 97, a: 1, mode: "practice", recognized: 7, total: 7, words: [] },
    { id: uid(), ts: daysAgo(2), s: 112, a: 1, mode: "practice", recognized: 4, total: 4, words: [] },
    { id: uid(), ts: daysAgo(3), s: 114, a: 1, mode: "review", recognized: 3, total: 5, words: [] },
  ];
  d.bookmarks = [
    { s: 2, a: 255, ts: daysAgo(4) },
    { s: 67, a: 1, ts: daysAgo(2) },
    { s: 94, a: 5, ts: daysAgo(1) },
  ];
  d.notes = [
    { id: uid(), s: 67, a: 2, text: "Review this ayah tomorrow — the middle section needs work.", created: daysAgo(2), updated: daysAgo(2) },
    { id: uid(), s: 97, a: 1, text: "Listen to Al-Husary slowly for the qalqalah in الْقَدْرِ.", created: daysAgo(1), updated: daysAgo(1) },
  ];
  d.lastRead = { s: 67, a: 3 };
  d.goals = { daily: 10, weeklyMem: 5, practice: 5, targetSurah: 67 };
  d.diffWords = { "طباقا": 3, "فطور": 2, "العالمين": 1 };
  
  // Add gamification data
  d.gamification = {
    xp: 450,
    level: 5,
    streak: 7,
    longestStreak: 7,
    lastActiveDate: todayKey(),
    achievements: getDefaultAchievements().map(ach => {
      if (ach.id === "first_ayah") return { ...ach, unlockedAt: daysAgo(6), progress: 100 };
      if (ach.id === "streak_7") return { ...ach, unlockedAt: daysAgo(0), progress: 100 };
      if (ach.id === "memorize_10") return { ...ach, progress: 40 };
      return ach;
    }),
    totalMinutesLearned: 125,
    totalAyahsRead: 10,
    totalAyahsMemorized: 4,
  };
  
  saveUserData(state.user.id, d);
  setState({ ...state, data: JSON.parse(JSON.stringify(d)) as UserData });
}

/* ---------------- Arabic matching ---------------- */

export function normalizeAr(s: string): string {
  return s
    .replace(/[\u064B-\u0652\u0670\u0640\u0610-\u061A\u06D6-\u06ED\u08F0-\u08FF\u0653-\u065F]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\u0621-\u064A\s]/g, "")
    .trim();
}

function lev(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const dist = lev(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

/** Compare spoken transcript against the verified word sequence.
    Returns a state per target word plus the recognized text. */
export function matchWords(targetWords: string[], spoken: string): { states: ("ok" | "review")[]; matched: number } {
  const targets = targetWords.map(normalizeAr).filter(Boolean);
  const tokens = spoken.split(/\s+/).map(normalizeAr).filter(Boolean);
  const used = new Array(tokens.length).fill(false);
  const states = targets.map(() => "review" as "ok" | "review");
  let matched = 0;
  targets.forEach((tw, ti) => {
    let best = -1, bestScore = 0;
    for (let k = 0; k < tokens.length; k++) {
      if (used[k]) continue;
      const drift = Math.abs(k - ti);
      const score = similarity(tw, tokens[k]) - drift * 0.02;
      if (score > bestScore) {
        bestScore = score;
        best = k;
      }
    }
    if (best >= 0 && bestScore >= 0.72) {
      used[best] = true;
      states[ti] = "ok";
      matched++;
    }
  });
  return { states, matched };
}

/* ---------------- speech recognition ---------------- */

type SpeechRec = {
  start: () => void;
  stop: () => void;
  supported: boolean;
};

export function speechSupported(): boolean {
  const w = window as unknown as Record<string, unknown>;
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function createRecognizer(handlers: {
  onInterim?: (text: string) => void;
  onFinal?: (text: string) => void;
  onEnd?: () => void;
  onError?: (e: string) => void;
}): SpeechRec {
  const w = window as unknown as Record<string, unknown>;
  const Ctor = (w.SpeechRecognition || w.webkitSpeechRecognition) as (new () => {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((e: { resultIndex: number; results: { [i: number]: { isFinal: boolean; 0: { transcript: string } }; length: number } }) => void) | null;
    onend: (() => void) | null;
    onerror: ((e: { error?: string }) => void) | null;
    start: () => void;
    stop: () => void;
  }) | undefined;
  if (!Ctor) return { start: () => {}, stop: () => {}, supported: false };
  const rec = new Ctor();
  rec.lang = "ar-SA";
  rec.continuous = true;
  rec.interimResults = true;
  rec.onresult = (e) => {
    let interim = "", final = "";
    for (let i = 0; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) final += r[0].transcript + " ";
      else interim += r[0].transcript + " ";
    }
    if (interim) handlers.onInterim?.(interim.trim());
    if (final) handlers.onFinal?.(final.trim());
  };
  rec.onend = () => handlers.onEnd?.();
  rec.onerror = (e) => handlers.onError?.(e.error || "unknown");
  return {
    start: () => {
      try {
        rec.start();
      } catch {
        /* already started */
      }
    },
    stop: () => {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    },
    supported: true,
  };
}

/* ---------------- recitation audio ---------------- */

export const RECITERS = [
  { id: "Alafasy_128kbps", name: "Mishary Rashid Alafasy" },
  { id: "Husary_128kbps", name: "Mahmoud Khalil Al-Husary" },
  { id: "Minshawy_Murattal_128kbps", name: "Mohamed Siddiq El-Minshawy" },
];

export const ayahAudioUrl = (reciter: string, s: number, a: number): string =>
  `https://everyayah.com/data/${reciter}/${pad3(s)}${pad3(a)}.mp3`;

/* ---------------- i18n ---------------- */

type Lang = "en" | "rw" | "ar";
const DICT: Record<string, [string, string, string]> = {
  // [en, rw, ar]
  "nav.home": ["Home", "Ahabanza", "الرئيسية"],
  "nav.quran": ["Qur'an", "Korowani", "القرآن"],
  "nav.practice": ["Practice", "Imyitozo", "التدريب"],
  "nav.review": ["Review", "Subiramo", "المراجعة"],
  "nav.progress": ["Progress", "Iterambere", "التقدم"],
  "nav.tajweed": ["Tajweed", "Tajweed", "التجويد"],
  "nav.bookmarks": ["Bookmarks", "Ibirango", "العلامات"],
  "nav.notes": ["Notes", "Inyandiko", "الملاحظات"],
  "nav.profile": ["Profile", "Umwirondoro", "الملف الشخصي"],
  "nav.settings": ["Settings", "Igenamiterere", "الإعدادات"],
  "nav.memorize": ["Memorize", "Fata mu mutwe", "الحفظ"],
  "nav.dashboard": ["Dashboard", "Imbonerahamwe", "لوحة التحكم"],
  "action.login": ["Log in", "Injira", "تسجيل الدخول"],
  "action.register": ["Create account", "Fungura konti", "إنشاء حساب"],
  "action.logout": ["Log out", "Sohoka", "تسجيل الخروج"],
  "action.start": ["Start Learning", "Tangira kwiga", "ابدأ التعلم"],
  "action.continue": ["Continue", "Komeza", "متابعة"],
  "action.listen": ["Listen", "Umva", "استمع"],
  "action.recite": ["Start reciting", "Tangira gusoma", "ابدأ التلاوة"],
  "action.memorize": ["Memorize", "Fata mu mutwe", "احفظ"],
  "action.bookmark": ["Bookmark", "Shyira ikirango", "علامة"],
  "action.note": ["Note", "Inyandiko", "ملاحظة"],
  "action.save": ["Save", "Bika", "حفظ"],
  "action.cancel": ["Cancel", "Hagarika", "إلغاء"],
  "action.tryAgain": ["Try again", "Ongera ugerageze", "حاول مجددًا"],
  "action.reveal": ["Reveal answer", "Erekana igisubizo", "أظهر الإجابة"],
  "action.revealMistake": ["Review mistakes", "Reba amakosa", "راجع الأخطاء"],
  "action.search": ["Search", "Shakisha", "بحث"],
  "dash.welcome": ["Assalamu alaikum", "Assalamu alaikum", "السلام عليكم"],
  "dash.continueLearning": ["Continue learning", "Komeza kwiga", "واصل التعلم"],
  "dash.todayGoal": ["Today's goal", "Intego y'uyu munsi", "هدف اليوم"],
  "dash.memorized": ["Ayahs memorized", "Aya zafashwe mu mutwe", "آيات محفوظة"],
  "dash.needsAttention": ["Need attention", "Zikwiye kwitabwaho", "تحتاج انتباه"],
  "dash.streak": ["Day streak", "Urukurikirane", "أيام متتالية"],
  "dash.startReview": ["Start review", "Tangira kureba", "ابدأ المراجعة"],
  "quran.read": ["Read", "Soma", "قراءة"],
  "quran.ayah": ["Ayah", "Aya", "آية"],
  "quran.surah": ["Surah", "Sura", "سورة"],
  "practice.recognized": ["words recognized", "amagambo yamenyekanye", "كلمات تم التعرف عليها"],
  "practice.hidden": ["Ayah hidden", "Aya yahishwe", "الآية مخفية"],
  "practice.fromMemory": ["Recite from memory", "Soma uvanye mu mutwe", "اقرأ من الذاكرة"],
  "settings.appearance": ["Appearance", "Isura", "المظهر"],
  "settings.language": ["Language", "Ururimi", "اللغة"],
};

export function t(key: string, lang?: Lang): string {
  const l = lang ?? (state.data?.settings.lang as Lang) ?? (read<string>(LS.lang, "en") as Lang) ?? "en";
  const entry = DICT[key];
  if (!entry) return key;
  return entry[l === "rw" ? 1 : l === "ar" ? 2 : 0];
}

export function setPublicLang(lang: Lang) {
  write(LS.lang, lang);
  state = { ...state };
  emit();
}

export function currentLang(): Lang {
  return (state.data?.settings.lang as Lang) ?? (read<string>(LS.lang, "en") as Lang) ?? "en";
}
