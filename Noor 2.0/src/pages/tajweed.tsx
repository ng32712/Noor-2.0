import { useMemo, useState } from "react";
import { LESSONS, type TajweedLesson } from "../data/tajweed";
import { getAyah, wordsOf } from "../data/quran";
import { ayahAudioUrl, recordQuiz, useApp } from "../lib/core";
import { Btn, Flower, Icon, Pill, Reveal, Star8, toast } from "../components/ui";

function playRef(ref: string, reciter: string) {
  const [s, a] = ref.split(":").map(Number);
  const el = new Audio(ayahAudioUrl(reciter, s, a));
  el.play().catch(() => toast("Audio unavailable — check your connection."));
}

/* ---------------- index ---------------- */

export function TajweedIndexPage({ inApp }: { inApp?: boolean }) {
  const { data } = useApp();
  const base = inApp ? "#/app/tajweed" : "#/tajweed";
  const taken = data?.quiz.length ?? 0;
  const avg = taken ? Math.round((data!.quiz.reduce((s, q) => s + q.correct / Math.max(1, q.total), 0) / taken) * 100) : null;
  return (
    <div className={inApp ? "" : "min-h-screen bg-cream grain"}>
      {!inApp && <div className="h-24" />}
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Pill className="bg-lav">
              <Icon name="sparkle" className="w-3.5 h-3.5" /> Tajweed Academy
            </Pill>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.9] mt-4">
              Ten rules,
              <br />
              <span className="text-lav-deep">one beautiful recitation.</span>
            </h1>
            <p className="text-ink/60 mt-4 max-w-lg">Learn → see a live example from the mushaf → listen → quiz yourself. Every example is cited from the validated dataset.</p>
          </div>
          {taken > 0 && (
            <div className="card-pop bg-sun rounded-3xl px-7 py-5 text-center">
              <p className="font-display text-4xl">{avg}%</p>
              <p className="text-xs font-bold uppercase tracking-widest text-ink/60">{taken} quizzes taken</p>
            </div>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {LESSONS.map((l, i) => (
            <Reveal key={l.id} delay={(i % 3) * 80}>
              <a href={`${base}/${l.id}`} className={`card-pop block ${l.color} rounded-[1.6rem] p-6 relative overflow-hidden ${i % 2 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]"} hover:rotate-0`}>
                <span className="absolute -right-2 -top-6 font-display text-[6rem] text-ink/10 leading-none select-none">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex items-start justify-between relative">
                  <p dir="rtl" lang="ar" className="font-quran text-3xl">{l.arabic}</p>
                  {i % 3 === 0 ? <Flower className="w-9 h-9" color="var(--color-paper)" /> : <Star8 className="w-8 h-8" color="var(--color-paper)" />}
                </div>
                <h3 className="font-display text-3xl uppercase mt-4">{l.title}</h3>
                <p className="text-sm text-ink/70 mt-1.5 font-semibold">{l.tagline}</p>
                <p className="text-sm text-ink/70 mt-3 line-clamp-2">{l.summary}</p>
                <span className="inline-flex items-center gap-2 mt-5 text-xs font-bold uppercase tracking-widest">
                  Start lesson <Icon name="arrowR" className="w-4 h-4" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- lesson ---------------- */

export function TajweedLessonPage({ id, inApp }: { id: string; inApp?: boolean }) {
  const { data } = useApp();
  const lesson = LESSONS.find((l) => l.id === id);
  const reciter = data?.settings.reciter ?? "Alafasy_128kbps";

  // mixed quiz: lesson quiz + one ayah-completion + one cross-rule question
  const quiz = useMemo(() => {
    if (!lesson) return [];
    const others = LESSONS.filter((l) => l.id !== lesson.id);
    const cross = others[Math.floor(Math.random() * others.length)].quiz;
    // ayah completion from an example ayah
    const ex = lesson.examples[0];
    const [es, ea] = ex.ref.split(":").map(Number);
    const words = wordsOf(es, ea);
    const hideIdx = Math.min(1, words.length - 1);
    const distractors = words.filter((_, i) => i !== hideIdx).slice(0, 2);
    const options = [words[hideIdx], ...distractors].sort(() => Math.random() - 0.5);
    const completion = {
      q: `Complete the ayah (${ex.ref}): ${words.map((w, i) => (i === hideIdx ? "＿＿＿" : w)).join(" ")}`,
      options,
      answer: options.indexOf(words[hideIdx]),
      explain: "From the validated dataset — compare with the mushaf any time.",
    };
    return [lesson.quiz, completion, cross];
  }, [lesson]);

  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [submitted, setSubmitted] = useState(false);

  if (!lesson) return <div className="p-20 text-center font-bold">Lesson not found. <a href="#/tajweed" className="underline">Back to Academy</a></div>;

  const pick = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers((p) => p.map((x, i) => (i === qi ? oi : x)));
  };
  const submit = () => {
    if (answers.some((a) => a === null)) {
      toast("Answer all three questions first.");
      return;
    }
    setSubmitted(true);
    const correct = answers.filter((a, i) => a === quiz[i].answer).length;
    recordQuiz(lesson.id, correct, quiz.length);
  };
  const score = answers.filter((a, i) => a === quiz[i]?.answer).length;

  return (
    <div className={inApp ? "" : "min-h-screen bg-cream grain"}>
      {!inApp && <div className="h-24" />}
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-10 relative z-10">
        <a href={inApp ? "#/app/tajweed" : "#/tajweed"} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink/50 hover:text-ink transition-colors">
          <Icon name="arrowL" className="w-4 h-4" /> All lessons
        </a>
        <div className={`card-pop ${lesson.color} rounded-[2rem] p-8 sm:p-10 mt-6 relative overflow-hidden`}>
          <span className="absolute -right-4 -bottom-10 font-display text-[10rem] text-ink/10 leading-none select-none">{lesson.arabic}</span>
          <Pill className="bg-paper">Tajweed lesson</Pill>
          <h1 className="font-display text-5xl sm:text-6xl uppercase mt-4">{lesson.title}</h1>
          <p className="font-bold uppercase tracking-widest text-sm mt-2 text-ink/60">{lesson.tagline}</p>
          <p className="mt-5 max-w-xl leading-relaxed text-ink/80">{lesson.summary}</p>
          {lesson.letters && (
            <div className="mt-6 bg-paper border-2 border-ink rounded-2xl px-6 py-4 inline-block">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Letters</p>
              <p dir="rtl" lang="ar" className="font-quran text-3xl mt-1">{lesson.letters}</p>
            </div>
          )}
        </div>

        {/* learn steps */}
        <section className="mt-12">
          <h2 className="font-display text-3xl uppercase flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-sun border-2 border-ink grid place-items-center font-display text-base">1</span> Learn
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            {lesson.steps.map((st, i) => (
              <div key={i} className="card-pop bg-paper rounded-2xl p-5">
                <span className="font-display text-3xl text-ink/20">{i + 1}</span>
                <p className="mt-2 font-semibold text-sm leading-relaxed">{st}</p>
              </div>
            ))}
          </div>
        </section>

        {/* examples */}
        <section className="mt-12">
          <h2 className="font-display text-3xl uppercase flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-lav border-2 border-ink grid place-items-center font-display text-base">2</span> See & listen
          </h2>
          <div className="space-y-4 mt-5">
            {lesson.examples.map((ex) => (
              <div key={ex.ref + ex.note} className="card-pop bg-paper rounded-[1.4rem] p-6 flex flex-wrap items-center gap-5">
                <div className="flex-1 min-w-[240px]">
                  <p dir="rtl" lang="ar" className="font-quran text-3xl leading-[2]">
                    {ex.arabic.split(ex.mark).map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && <mark className="bg-sun border-2 border-ink rounded-lg px-1.5 font-quran">{ex.mark}</mark>}
                      </span>
                    ))}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink/50 mt-2">{getAyah(Number(ex.ref.split(":")[0]), Number(ex.ref.split(":")[1])) ? `Surah ${ex.ref} · from the validated dataset` : ex.ref}</p>
                  <p className="text-sm text-ink/65 mt-2">{ex.note}</p>
                </div>
                <button onClick={() => playRef(ex.ref, reciter)} className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-full bg-ink text-cream border-2 border-ink grid place-items-center hover:bg-burg transition-colors cursor-pointer" aria-label={`Listen to ${ex.ref}`}>
                  <Icon name="play" className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* quiz */}
        <section className="mt-12">
          <h2 className="font-display text-3xl uppercase flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-blush border-2 border-ink grid place-items-center font-display text-base">3</span> Quiz yourself
          </h2>
          <div className="space-y-6 mt-5">
            {quiz.map((qq, qi) => (
              <div key={qi} className={`card-pop rounded-[1.4rem] p-6 ${submitted ? (answers[qi] === qq.answer ? "bg-sun/50" : "bg-blush/40") : "bg-paper"}`}>
                <p className="font-bold leading-relaxed" dir={qq.q.includes("ـ") || /[\u0600-\u06FF]/.test(qq.q.slice(0, 30)) ? "auto" : "ltr"}>{qq.q}</p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {qq.options.map((opt, oi) => {
                    const chosen = answers[qi] === oi;
                    const correct = submitted && oi === qq.answer;
                    const wrong = submitted && chosen && oi !== qq.answer;
                    return (
                      <button
                        key={oi}
                        onClick={() => pick(qi, oi)}
                        dir="auto"
                        className={`border-2 border-ink rounded-xl px-4 py-3 text-left font-semibold text-sm transition-all cursor-pointer ${correct ? "bg-sun" : wrong ? "bg-blush" : chosen ? "bg-lav" : "bg-cream hover:bg-lav/50"}`}
                      >
                        <span className="font-quran text-lg">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {submitted && <p className="text-xs text-ink/60 mt-3 font-semibold">{qq.explain}</p>}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-7">
            {!submitted ? (
              <Btn variant="ink" onClick={submit}>
                <Icon name="check" className="w-4 h-4" /> Submit answers
              </Btn>
            ) : (
              <>
                <div className={`font-display text-3xl border-2 border-ink rounded-2xl px-6 py-3 ${score === quiz.length ? "bg-sun" : score >= 2 ? "bg-lav" : "bg-blush"}`}>
                  {score} / {quiz.length}
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-ink/60">
                  {score === quiz.length ? "Excellent — saved to your history." : score >= 2 ? "Good — saved. One more listen?" : "Saved. Re-listen and retry."}
                </p>
                <Btn variant="cream" onClick={() => { setAnswers([null, null, null]); setSubmitted(false); }}>
                  <Icon name="refresh" className="w-4 h-4" /> Retry
                </Btn>
              </>
            )}
          </div>
          <p className="text-xs text-ink/45 mt-4">Quiz results are saved to your account. Matching reports what the app recognized — for authoritative tajweed guidance, learn with a qualified teacher.</p>
        </section>
      </div>
    </div>
  );
}
