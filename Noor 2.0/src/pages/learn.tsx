import { useState } from "react";
import { surahAyahs, surahMeta } from "../data/quran";
import {
  changePassword, deleteAccount, deleteNote, last7Days, logout, memorizedCount, patchGoals, patchProfile, patchSettings,
  recordQuiz, reviewQueue, streak, todayActivity, upsertNote, useApp, RECITERS,
} from "../lib/core";
import { AyahSnippet } from "./quran";
import { AvatarBadge, Btn, Icon, Modal, Pill, Reveal, StatRing, timeAgo, toast } from "../components/ui";

/* ---------------- dashboard ---------------- */

export function DashboardPage() {
  const { user, data } = useApp();
  if (!user || !data) return null;
  const today = todayActivity(data);
  const done = Math.min(today.goal, today.read + today.practiced);
  const q = reviewQueue(data);
  const mem = memorizedCount(data);
  const st = streak(data);
  const week = last7Days(data);
  const maxWeek = Math.max(1, ...week.map((d) => d.count));
  const last = data.lastRead ?? { s: data.goals.targetSurah, a: 1 };
  const lastMeta = surahMeta(last.s);
  const weekMem = Object.values(data.mem).filter((m) => m.lastSuccess && Date.now() - m.lastSuccess < 7 * 86400000).length;
  const firstName = user.name.split(" ")[0].toUpperCase();

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Pill className="bg-sun">
            <Icon name="sparkle" className="w-3.5 h-3.5" /> Your space
          </Pill>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.9] mt-5">
            Assalamu alaikum,
            <br />
            <span className="text-burg">{firstName}</span> <span className="inline-block -rotate-6">👋</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className={`border-2 border-ink rounded-2xl px-5 py-3 flex items-center gap-3 ${st > 0 ? "bg-sun" : "bg-paper"}`}>
            <Icon name="flame" className="w-7 h-7" />
            <div>
              <p className="font-display text-2xl leading-none">{st}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/60">day streak</p>
            </div>
          </div>
          <AvatarBadge color={user.avatar.color} glyph={user.avatar.glyph} size="w-14 h-14 text-xl" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-12">
        {/* continue learning */}
        <Reveal className="lg:col-span-2">
          <div className="card-pop bg-forest text-cream rounded-[2rem] p-8 sm:p-9 relative overflow-hidden h-full">
            <div className="absolute -right-8 -bottom-10 opacity-20">
              <Icon name="book" className="w-52 h-52" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sun">Continue learning</p>
            <h2 className="font-display text-4xl sm:text-5xl uppercase mt-3">
              Surah {lastMeta.name}
            </h2>
            <p className="text-cream/70 mt-1 font-semibold">
              Ayahs {last.a}–{Math.min(lastMeta.ayahs, last.a + 4)} · {lastMeta.meaning}
            </p>
            <div className="bg-cream/10 border-2 border-cream/25 rounded-2xl p-5 mt-6 max-w-xl">
              <AyahSnippet s={last.s} a={last.a} />
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href={`#/app/quran/${last.s}/${last.a}`}>
                <Btn variant="sun">
                  {`Continue`} <Icon name="arrowR" className="w-4 h-4" />
                </Btn>
              </a>
              <a href={`#/app/practice/${last.s}/${last.a}`}>
                <Btn variant="cream">
                  <Icon name="mic" className="w-4 h-4" /> Practice it
                </Btn>
              </a>
            </div>
          </div>
        </Reveal>

        {/* today's goal */}
        <Reveal delay={100}>
          <div className="card-pop bg-paper rounded-[2rem] p-7 h-full flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink/50">Today's goal</p>
            <div className="my-5">
              <StatRing value={done} max={today.goal} size={150} label="ayahs" />
            </div>
            <p className="text-sm text-ink/60">
              Read <strong className="text-ink">{today.read}</strong> · Practiced <strong className="text-ink">{today.practiced}</strong>
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-ink/40">Daily target: {today.goal} ayahs</p>
          </div>
        </Reveal>

        {/* memorization */}
        <Reveal>
          <div className="card-pop bg-lav rounded-[2rem] p-7 relative overflow-hidden">
            <Icon name="brain" className="absolute -right-4 -bottom-4 w-28 h-28 opacity-15" />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-lav-deep">Memorization</p>
            <p className="font-display text-6xl mt-3">{mem}</p>
            <p className="font-bold uppercase tracking-widest text-sm mt-1">ayahs memorized</p>
            <p className="text-sm text-ink/60 mt-3">
              {weekMem} new this week · goal {data.goals.weeklyMem}
            </p>
            <div className="h-2.5 bg-ink/10 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-lav-deep rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (weekMem / Math.max(1, data.goals.weeklyMem)) * 100)}%` }} />
            </div>
          </div>
        </Reveal>

        {/* review */}
        <Reveal delay={80}>
          <div className="card-pop bg-burg text-cream rounded-[2rem] p-7 h-full flex flex-col">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blush">Review</p>
            <p className="font-display text-6xl mt-3">{q.attention.length}</p>
            <p className="font-bold uppercase tracking-widest text-sm mt-1">ayahs need attention</p>
            <p className="text-sm text-cream/70 mt-3 flex-1">{q.soon.length} due soon · {q.strong.length} strong</p>
            <a href="#/app/review" className="mt-4">
              <Btn variant="sun" className="w-full">
                Start review <Icon name="arrowR" className="w-4 h-4" />
              </Btn>
            </a>
          </div>
        </Reveal>

        {/* week activity */}
        <Reveal delay={160}>
          <div className="card-pop bg-sun rounded-[2rem] p-7 h-full">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink/55">This week</p>
            <div className="flex items-end gap-2 h-28 mt-6">
              {week.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full bg-ink/10 rounded-lg flex-1 flex items-end overflow-hidden">
                    <div className="w-full bg-ink rounded-lg transition-all duration-700" style={{ height: `${(d.count / maxWeek) * 100}%`, minHeight: d.count ? 6 : 0 }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-ink/60">{d.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink/55 mt-4">{week.reduce((s, d) => s + d.count, 0)} learning touches this week</p>
          </div>
        </Reveal>
      </div>

      {/* recent sessions + difficult words */}
      <div className="grid lg:grid-cols-5 gap-6 mt-6">
        <Reveal className="lg:col-span-3">
          <div className="card-pop bg-paper rounded-[2rem] p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl uppercase">Recent practice</h3>
              <a href="#/app/progress" className="text-xs font-bold uppercase tracking-widest text-burg hover:underline">
                Full progress →
              </a>
            </div>
            {data.sessions.length === 0 ? (
              <p className="text-sm text-ink/50 mt-4">No sessions yet — your first recitation will appear here.</p>
            ) : (
              <ul className="mt-4 divide-y-2 divide-ink/8">
                {data.sessions.slice(0, 5).map((s) => (
                  <li key={s.id} className="py-3 flex items-center gap-4">
                    <span className={`w-9 h-9 rounded-xl border-2 border-ink grid place-items-center ${s.mode === "memorize" ? "bg-lav" : s.mode === "review" ? "bg-blush" : "bg-sun"}`}>
                      <Icon name={s.mode === "memorize" ? "brain" : s.mode === "review" ? "refresh" : "mic"} className="w-4 h-4" />
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-sm">
                        {surahMeta(s.s).name} {s.s}:{s.a} <span className="text-ink/40 font-semibold">· {s.mode}</span>
                      </p>
                      <p className="text-xs text-ink/50">{timeAgo(s.ts)}</p>
                    </div>
                    <span className={`text-xs font-bold border-2 border-ink rounded-full px-3 py-1 ${s.recognized === s.total ? "bg-sun" : "bg-cream"}`}>
                      {s.recognized}/{s.total}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-2">
          <div className="card-pop bg-cream rounded-[2rem] p-7 h-full">
            <h3 className="font-display text-2xl uppercase">Tricky words</h3>
            <p className="text-xs text-ink/55 mt-1">Words the recognizer keeps missing for you.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(data.diffWords)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([w, n]) => (
                  <span key={w} className="border-2 border-ink rounded-full bg-paper px-3.5 py-1.5 font-quran text-xl" dir="rtl">
                    {w} <span className="text-[10px] font-body font-bold text-burg align-super">×{n}</span>
                  </span>
                ))}
              {Object.keys(data.diffWords).length === 0 && <p className="text-sm text-ink/45 italic">None yet — nice and clean.</p>}
            </div>
            <a href="#/app/practice" className="inline-block mt-6">
              <Btn variant="ink">
                <Icon name="mic" className="w-4 h-4" /> Practice now
              </Btn>
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ---------------- progress ---------------- */

export function ProgressPage() {
  const { user, data } = useApp();
  if (!user || !data) return null;
  const surahsExplored = new Set(data.readKeys.map((k) => Number(k.split(":")[0]))).size;
  const sessions = data.sessions.length;
  const avgRec = sessions ? Math.round((data.sessions.reduce((s, x) => s + (x.total ? x.recognized / x.total : 0), 0) / sessions) * 100) : 0;
  const q = reviewQueue(data);
  const month = Object.entries(data.daily).filter(([k]) => Date.now() - new Date(k).getTime() < 30 * 86400000).reduce((s, [, v]) => s + v.read.length + v.practiced.length, 0);
  const week = last7Days(data);
  const maxWeek = Math.max(1, ...week.map((d) => d.count));

  const Stat = ({ big, label, bg }: { big: string | number; label: string; bg: string }) => (
    <div className={`card-pop ${bg} rounded-3xl p-6 text-center`}>
      <p className="font-display text-5xl">{big}</p>
      <p className="text-xs font-bold uppercase tracking-widest text-ink/60 mt-2">{label}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
      <Pill className="bg-blush">
        <Icon name="chart" className="w-3.5 h-3.5" /> Personal progress
      </Pill>
      <h1 className="font-display text-5xl sm:text-6xl uppercase leading-[0.92] mt-4">
        Learning activity,
        <br />
        <span className="text-blush-deep">not merit scores.</span>
      </h1>
      <p className="text-ink/60 mt-4 max-w-xl">These numbers describe your practice habits — how often and how firmly — so you can steer your next session. Nothing more, nothing less.</p>

      <section className="mt-12">
        <h2 className="font-display text-3xl uppercase mb-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-sun border-2 border-ink grid place-items-center"><Icon name="book" className="w-4 h-4" /></span> Qur'an
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat big={data.readKeys.length} label="Ayahs read" bg="bg-paper" />
          <Stat big={surahsExplored} label="Surahs explored" bg="bg-sun/60" />
          <Stat big={Math.max(1, Math.ceil(data.readKeys.length / 15))} label="≈ pages covered" bg="bg-paper" />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl uppercase mb-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-lav border-2 border-ink grid place-items-center"><Icon name="brain" className="w-4 h-4" /></span> Memorization
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat big={memorizedCount(data)} label="Ayahs memorized" bg="bg-lav/70" />
          <Stat big={Object.values(data.mem).filter((m) => m.attempts > 0 && m.strength < 80).length} label="In training" bg="bg-paper" />
          <Stat big={`${data.goals.targetSurah ? surahMeta(data.goals.targetSurah).name : "—"}`} label="Current target" bg="bg-paper" />
        </div>
      </section>

      <section className="mt-12 grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-3xl uppercase mb-4 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-blush border-2 border-ink grid place-items-center"><Icon name="mic" className="w-4 h-4" /></span> Recitation
          </h2>
          <div className="card-pop bg-paper rounded-3xl p-7">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-display text-4xl">{sessions}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/55 mt-1">sessions</p>
              </div>
              <div>
                <p className="font-display text-4xl">{avgRec}%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/55 mt-1">avg recognition</p>
              </div>
              <div>
                <p className="font-display text-4xl">{Object.keys(data.diffWords).length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/55 mt-1">tricky words</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {Object.entries(data.diffWords).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w, n]) => (
                <span key={w} dir="rtl" className="font-quran text-lg border-2 border-ink rounded-full bg-blush/50 px-3 py-0.5">{w} ×{n}</span>
              ))}
              {Object.keys(data.diffWords).length === 0 && <p className="text-sm text-ink/45 italic">No recurring misses yet.</p>}
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl uppercase mb-4 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-sun border-2 border-ink grid place-items-center"><Icon name="flame" className="w-4 h-4" /></span> Consistency
          </h2>
          <div className="card-pop bg-paper rounded-3xl p-7">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-display text-5xl">{streak(data)}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/55 mt-1">day streak</p>
              </div>
              <div className="text-center">
                <p className="font-display text-5xl">{month}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/55 mt-1">touches / 30 days</p>
              </div>
            </div>
            <div className="flex items-end gap-2 h-20 mt-6">
              {week.map((d, i) => (
                <div key={i} className="flex-1 bg-ink/10 rounded-lg flex items-end overflow-hidden">
                  <div className="w-full bg-burg rounded-lg" style={{ height: `${(d.count / maxWeek) * 100}%`, minHeight: d.count ? 5 : 0 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl uppercase mb-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-forest text-cream border-2 border-ink grid place-items-center"><Icon name="refresh" className="w-4 h-4" /></span> Revision
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Stat big={data.sessions.filter((s) => s.mode === "review").length} label="Reviews completed" bg="bg-paper" />
          <Stat big={q.attention.length + q.soon.length} label="Pending reviews" bg="bg-blush/60" />
          <Stat big={q.strong.length} label="Holding strong" bg="bg-sun/60" />
        </div>
      </section>
    </div>
  );
}

/* ---------------- bookmarks ---------------- */

export function BookmarksPage() {
  const { data } = useApp();
  if (!data) return null;
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-10">
      <Pill className="bg-sun">
        <Icon name="bookmark" className="w-3.5 h-3.5" /> Saved for later
      </Pill>
      <h1 className="font-display text-5xl sm:text-6xl uppercase leading-[0.92] mt-4">
        My <span className="text-burg">bookmarks.</span>
      </h1>
      {data.bookmarks.length === 0 ? (
        <div className="bg-paper border-2 border-ink rounded-[2rem] shadow-hard p-10 text-center mt-10">
          <Icon name="bookmark" className="w-12 h-12 mx-auto text-ink/30" />
          <h2 className="font-display text-3xl uppercase mt-4">No bookmarks yet</h2>
          <p className="text-ink/60 mt-2 text-sm">Tap the bookmark button on any ayah in the reader and it will wait for you here.</p>
          <a href="#/app/quran" className="inline-block mt-6"><Btn variant="ink">Open the mushaf</Btn></a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          {data.bookmarks.map((b) => {
            const meta = surahMeta(b.s);
            const hasNote = data.notes.some((n) => n.s === b.s && n.a === b.a);
            return (
              <Reveal key={`${b.s}:${b.a}`}>
                <div className="card-pop bg-paper rounded-[1.6rem] p-6 relative">
                  <div className="flex items-center justify-between">
                    <Pill className="bg-lav">{meta.name} · {b.s}:{b.a}</Pill>
                    {hasNote && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-sun border-2 border-ink rounded-full px-2.5 py-1 flex items-center gap-1">
                        <Icon name="note" className="w-3 h-3" /> Note
                      </span>
                    )}
                  </div>
                  <div className="mt-4"><AyahSnippet s={b.s} a={b.a} max={90} /></div>
                  <p className="text-xs text-ink/55 mt-3 italic line-clamp-2">{/* translation snippet lives in reader */}Saved {timeAgo(b.ts)}</p>
                  <div className="flex gap-3 mt-5">
                    <a href={`#/app/quran/${b.s}/${b.a}`}><Btn variant="ink">Continue <Icon name="arrowR" className="w-4 h-4" /></Btn></a>
                    <a href={`#/app/practice/${b.s}/${b.a}`}><Btn variant="cream"><Icon name="mic" className="w-4 h-4" /> Practice</Btn></a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------- notes ---------------- */

export function NotesPage() {
  const { data } = useApp();
  const [editing, setEditing] = useState<{ s: number; a: number; text: string } | null>(null);
  const [text, setText] = useState("");
  if (!data) return null;
  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-10">
      <Pill className="bg-lav">
        <Icon name="note" className="w-3.5 h-3.5" /> Private journal
      </Pill>
      <h1 className="font-display text-5xl sm:text-6xl uppercase leading-[0.92] mt-4">
        My <span className="text-lav-deep">notes.</span>
      </h1>
      <p className="text-ink/60 mt-4">Attached to ayahs, visible only to you. Perfect for “review tomorrow” reminders and tadabbur reflections.</p>
      {data.notes.length === 0 ? (
        <div className="bg-paper border-2 border-ink rounded-[2rem] shadow-hard p-10 text-center mt-10">
          <Icon name="note" className="w-12 h-12 mx-auto text-ink/30" />
          <h2 className="font-display text-3xl uppercase mt-4">No notes yet</h2>
          <p className="text-ink/60 mt-2 text-sm">Open any ayah in the reader and tap “Note”.</p>
        </div>
      ) : (
        <div className="space-y-5 mt-10">
          {data.notes.map((n) => (
            <div key={n.id} className="card-pop bg-paper rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <a href={`#/app/quran/${n.s}/${n.a}`} className="font-bold text-sm bg-cream border-2 border-ink rounded-full px-4 py-1.5 hover:bg-sun transition-colors">
                  {surahMeta(n.s).name} {n.s}:{n.a} ↗
                </a>
                <span className="text-xs text-ink/45 font-semibold">updated {timeAgo(n.updated)}</span>
              </div>
              <p className="mt-4 text-lg leading-relaxed">{n.text}</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { setEditing(n); setText(n.text); }} className="text-xs font-bold uppercase tracking-widest border-2 border-ink rounded-full px-4 py-1.5 bg-cream hover:bg-lav transition-colors cursor-pointer">Edit</button>
                <button onClick={() => { deleteNote(n.id); toast("Note deleted"); }} className="text-xs font-bold uppercase tracking-widest border-2 border-ink rounded-full px-4 py-1.5 bg-cream hover:bg-blush transition-colors cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit note">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full border-2 border-ink rounded-xl bg-cream p-4 font-medium outline-none focus:bg-sun/25" />
        <div className="flex gap-3 mt-5">
          <Btn variant="ink" onClick={() => { if (editing) { upsertNote(editing.s, editing.a, text.trim()); toast("Note updated"); setEditing(null); } }}>Save</Btn>
          <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------- profile ---------------- */

export function ProfilePage() {
  const { user, data } = useApp();
  const [name, setName] = useState(user?.name ?? "");
  if (!user || !data) return null;
  const colors = ["bg-burg", "bg-lav-deep", "bg-sun-deep", "bg-blush-deep", "bg-forest-soft", "bg-sage"];
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-10">
      <Pill className="bg-blush">
        <Icon name="user" className="w-3.5 h-3.5" /> Your identity
      </Pill>
      <h1 className="font-display text-5xl sm:text-6xl uppercase leading-[0.92] mt-4">Profile.</h1>
      <div className="card-pop bg-paper rounded-[2rem] p-8 mt-10">
        <div className="flex flex-wrap items-center gap-6">
          <AvatarBadge color={user.avatar.color} glyph={user.avatar.glyph} size="w-24 h-24 text-4xl" />
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/55">Display name</label>
            <div className="flex gap-3 mt-2">
              <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 border-2 border-ink rounded-xl bg-cream px-4 py-3 font-medium outline-none focus:bg-sun/25" />
              <Btn variant="ink" onClick={() => { patchProfile({ name: name.trim() || user.name }); toast("Profile updated"); }}>Save</Btn>
            </div>
            <p className="text-sm text-ink/55 mt-3">{user.email}</p>
            <p className="text-xs text-ink/45 mt-1">Learning since {new Date(user.createdAt).toLocaleDateString("en", { month: "long", year: "numeric" })}</p>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/55 mb-3">Avatar color</p>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button key={c} onClick={() => { patchProfile({ avatar: { color: c } }); toast("Avatar updated"); }} className={`w-12 h-12 rounded-full border-2 border-ink cursor-pointer transition-transform hover:scale-110 ${c} ${user.avatar.color === c ? "ring-4 ring-sun" : ""}`} aria-label={`Avatar color ${c}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="card-pop bg-cream rounded-[2rem] p-8 mt-6">
        <h3 className="font-display text-2xl uppercase">Learning setup</h3>
        <div className="grid sm:grid-cols-2 gap-6 mt-5 text-sm">
          <div className="flex justify-between border-b-2 border-ink/10 pb-3"><span className="text-ink/55 font-semibold">Daily goal</span><strong>{data.goals.daily} ayahs</strong></div>
          <div className="flex justify-between border-b-2 border-ink/10 pb-3"><span className="text-ink/55 font-semibold">Weekly memorization</span><strong>{data.goals.weeklyMem} ayahs</strong></div>
          <div className="flex justify-between border-b-2 border-ink/10 pb-3"><span className="text-ink/55 font-semibold">Current target</span><strong>{surahMeta(data.goals.targetSurah).name}</strong></div>
          <div className="flex justify-between border-b-2 border-ink/10 pb-3"><span className="text-ink/55 font-semibold">Preferred reciter</span><strong>{RECITERS.find((r) => r.id === data.settings.reciter)?.name}</strong></div>
        </div>
        <a href="#/app/settings" className="inline-block mt-6"><Btn variant="ink">Adjust in settings <Icon name="gear" className="w-4 h-4" /></Btn></a>
      </div>
    </div>
  );
}

/* ---------------- settings ---------------- */

export function SettingsPage() {
  const { user, data } = useApp();
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  if (!user || !data) return null;
  const s = data.settings;

  const Seg = ({ value, options, onChange, label }: { value: string; options: [string, string][]; onChange: (v: string) => void; label: string }) => (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-ink/55 mb-2">{label}</p>
      <div className="flex border-2 border-ink rounded-xl overflow-hidden w-fit">
        {options.map(([v, l]) => (
          <button key={v} onClick={() => onChange(v)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${value === v ? "bg-ink text-cream" : "bg-paper hover:bg-cream"}`}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-10">
      <Pill className="bg-sun">
        <Icon name="gear" className="w-3.5 h-3.5" /> Make it yours
      </Pill>
      <h1 className="font-display text-5xl sm:text-6xl uppercase leading-[0.92] mt-4">Settings.</h1>

      <div className="card-pop bg-paper rounded-[2rem] p-8 mt-10 space-y-7">
        <h3 className="font-display text-2xl uppercase">Appearance</h3>
        <Seg label="Theme" value={s.theme} options={[["light", "Light"], ["dark", "Dark"], ["system", "System"]]} onChange={(v) => patchSettings({ theme: v as typeof s.theme })} />
      </div>

      <div className="card-pop bg-cream rounded-[2rem] p-8 mt-6 space-y-7">
        <h3 className="font-display text-2xl uppercase">Language</h3>
        <Seg label="Interface" value={s.lang} options={[["en", "English"], ["rw", "Kinyarwanda"], ["ar", "العربية"]]} onChange={(v) => patchSettings({ lang: v as typeof s.lang })} />
        <p className="text-xs text-ink/50 -mt-3">Qur'anic text is always shown in Arabic; translations are in English.</p>
      </div>

      <div className="card-pop bg-paper rounded-[2rem] p-8 mt-6 space-y-6">
        <h3 className="font-display text-2xl uppercase">Qur'an reading</h3>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink/55 mb-2">Arabic font size — {s.arabicSize}px</p>
          <input type="range" min={24} max={56} value={s.arabicSize} onChange={(e) => patchSettings({ arabicSize: Number(e.target.value) })} className="w-full max-w-sm" aria-label="Arabic font size" />
          <p dir="rtl" lang="ar" className="font-quran mt-3 text-forest-soft" style={{ fontSize: `${s.arabicSize * 0.8}px` }}>الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={s.showTranslation} onChange={(e) => patchSettings({ showTranslation: e.target.checked })} className="w-5 h-5 accent-[var(--color-burg)]" />
            <span className="text-sm font-bold">Show translation</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={s.autoPlay} onChange={(e) => patchSettings({ autoPlay: e.target.checked })} className="w-5 h-5 accent-[var(--color-burg)]" />
            <span className="text-sm font-bold">Auto-play next ayah</span>
          </label>
        </div>
      </div>

      <div className="card-pop bg-lav/60 rounded-[2rem] p-8 mt-6 space-y-6">
        <h3 className="font-display text-2xl uppercase">Learning</h3>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            ["daily", "Daily reading goal", 3, 30],
            ["weeklyMem", "Weekly memorization", 1, 20],
            ["practice", "Daily practice sessions", 1, 20],
          ].map(([key, label, min, max]) => (
            <div key={key as string}>
              <p className="text-xs font-bold uppercase tracking-widest text-ink/55 mb-2">{label as string}</p>
              <div className="flex items-center border-2 border-ink rounded-xl bg-paper w-fit">
                <button className="px-3 py-2 font-display text-lg cursor-pointer hover:bg-cream" onClick={() => patchGoals({ [key as string]: Math.max(min as number, (data.goals[key as keyof typeof data.goals] as number) - 1) } as never)}>−</button>
                <span className="px-4 font-display text-xl">{data.goals[key as keyof typeof data.goals] as number}</span>
                <button className="px-3 py-2 font-display text-lg cursor-pointer hover:bg-cream" onClick={() => patchGoals({ [key as string]: Math.min(max as number, (data.goals[key as keyof typeof data.goals] as number) + 1) } as never)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink/55 mb-2">Memorization target surah</p>
          <div className="flex flex-wrap gap-2">
            {[1, 67, 97, 103, 112, 113, 114].map((id) => (
              <button key={id} onClick={() => patchGoals({ targetSurah: id })} className={`border-2 border-ink rounded-full px-4 py-1.5 text-sm font-bold cursor-pointer transition-all ${data.goals.targetSurah === id ? "bg-sun shadow-hard-sm" : "bg-paper hover:bg-sun/50"}`}>
                {surahMeta(id).name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink/55 mb-2">Preferred reciter</p>
          <select value={s.reciter} onChange={(e) => patchSettings({ reciter: e.target.value })} className="border-2 border-ink rounded-xl bg-paper px-4 py-2.5 font-bold cursor-pointer">
            {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card-pop bg-paper rounded-[2rem] p-8 mt-6 space-y-5">
        <h3 className="font-display text-2xl uppercase">Account</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <input type="password" value={curPass} onChange={(e) => setCurPass(e.target.value)} placeholder="Current password" className="border-2 border-ink rounded-xl bg-cream px-4 py-3 font-medium outline-none focus:bg-sun/25" />
          <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New password (6+)" className="border-2 border-ink rounded-xl bg-cream px-4 py-3 font-medium outline-none focus:bg-sun/25" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Btn variant="ink" onClick={async () => {
            const res = await changePassword(curPass, newPass);
            if (res.ok) { toast("Password changed"); setCurPass(""); setNewPass(""); } else toast(res.error || "Could not change password");
          }}>
            <Icon name="lock" className="w-4 h-4" /> Change password
          </Btn>
          <Btn variant="cream" onClick={() => { logout(); location.hash = "#/"; }}>
            <Icon name="logout" className="w-4 h-4" /> Log out
          </Btn>
          <Btn variant="burg" onClick={() => setConfirmDel(true)}>
            <Icon name="trash" className="w-4 h-4" /> Delete account
          </Btn>
        </div>
        <p className="text-xs text-ink/45">Deleting removes your profile and every bookmark, note, session and memorization state — permanently.</p>
      </div>

      <Modal open={confirmDel} onClose={() => setConfirmDel(false)} title="Delete account?">
        <p className="text-ink/70">This wipes <strong>{user.name}</strong>'s learning data from this device. There is no undo.</p>
        <div className="flex gap-3 mt-6">
          <Btn variant="burg" onClick={() => { deleteAccount(); location.hash = "#/"; }}>Yes, delete everything</Btn>
          <Btn variant="ghost" onClick={() => setConfirmDel(false)}>Keep my account</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* keep recordQuiz referenced for quiz pages */
export const __q = recordQuiz;
export const __ay = surahAyahs;
