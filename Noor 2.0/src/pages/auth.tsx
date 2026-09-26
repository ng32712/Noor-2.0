import { useState, type FormEvent, type ReactNode } from "react";
import { login, register, requestReset, doReset, seedDemoData, patchGoals } from "../lib/core";
import { Btn, Flower, Icon, Star8 } from "../components/ui";

function AuthShell({ children, title, sub }: { children: ReactNode; title: string; sub: string }) {
  return (
    <div className="min-h-screen bg-forest grain relative overflow-hidden">
      <div className="absolute inset-0 dot-grid-light opacity-30" />
      <div className="absolute top-10 left-8 floaty opacity-90">
        <Flower className="w-16 h-16" />
      </div>
      <div className="absolute bottom-12 right-10 floaty">
        <Star8 className="w-14 h-14" color="var(--color-sun)" />
      </div>
      <div className="relative z-10 min-h-screen grid place-items-center px-5 py-16">
        <div className="w-full max-w-md">
          <a href="#/" className="flex items-center justify-center gap-3 mb-8 group">
            <span className="w-11 h-11 rounded-2xl bg-sun border-2 border-ink grid place-items-center shadow-hard-sm group-hover:rotate-6 transition-transform">
              <Icon name="moon" className="w-6 h-6 text-ink" />
            </span>
            <span className="font-display text-2xl text-cream tracking-wide">NOOR</span>
          </a>
          <div className="bg-paper border-2 border-ink shadow-hard rounded-[2rem] p-8 sm:p-10 relative">
            <div className="absolute -top-5 -right-4 rotate-12">
              <Star8 className="w-10 h-10" color="var(--color-blush)" />
            </div>
            <h1 className="font-display text-4xl uppercase leading-none">{title}</h1>
            <p className="text-sm text-ink/60 mt-3">{sub}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, icon }: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; icon?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-ink/60">{label}</span>
      <div className="relative mt-1.5">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40">
            <Icon name={icon} className="w-4.5 h-4.5" />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border-2 border-ink rounded-xl bg-cream px-4 py-3 text-sm font-medium outline-none focus:bg-sun/30 transition-colors ${icon ? "pl-10" : ""}`}
        />
      </div>
    </label>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await login(email, pass);
    setBusy(false);
    if (!res.ok) setError(res.error || "Login failed.");
    else location.hash = "#/app";
  };

  const demo = async () => {
    setBusy(true);
    setError("");
    let res = await login("issa@noor.app", "noor-demo");
    if (!res.ok) {
      res = await register("Issa", "issa@noor.app", "noor-demo");
    }
    seedDemoData();
    setBusy(false);
    if (res.ok) location.hash = "#/app";
  };

  return (
    <AuthShell title="Welcome back" sub="Log in to continue your Qur'an journey exactly where you left it.">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon="mail" />
        <Field label="Password" type="password" value={pass} onChange={setPass} placeholder="••••••••" icon="lock" />
        {error && <p className="text-sm font-semibold text-burg bg-blush/40 border-2 border-burg/40 rounded-xl px-4 py-2.5">{error}</p>}
        <Btn type="submit" variant="ink" className="w-full py-3.5" disabled={busy}>
          {t("action.login")} <Icon name="arrowR" className="w-4 h-4" />
        </Btn>
      </form>
      <div className="flex items-center gap-3 my-6">
        <span className="h-[2px] bg-ink/15 flex-1" />
        <span className="text-xs font-bold uppercase tracking-widest text-ink/40">or</span>
        <span className="h-[2px] bg-ink/15 flex-1" />
      </div>
      <Btn variant="sun" className="w-full py-3.5" onClick={demo} disabled={busy}>
        <Icon name="sparkle" className="w-4 h-4" /> Try the demo account
      </Btn>
      <p className="text-xs text-ink/50 mt-3 text-center">The demo account comes pre-loaded with progress, streaks and a review queue.</p>
      <div className="flex justify-between text-sm font-semibold mt-6">
        <a href="#/reset" className="text-burg hover:underline">
          Forgot password?
        </a>
        <a href="#/register" className="hover:underline">
          Create account →
        </a>
      </div>
    </AuthShell>
  );
}

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [goal, setGoal] = useState(10);
  const [target, setTarget] = useState(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pass !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    setError("");
    const res = await register(name, email, pass);
    if (res.ok) {
      patchGoals({ daily: goal, targetSurah: target });
      location.hash = "#/app";
    } else {
      setError(res.error || "Registration failed.");
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Start here" sub="Create your personal space — your progress, bookmarks and notes stay yours.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Your name" value={name} onChange={setName} placeholder="e.g. Issa" icon="user" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon="mail" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" type="password" value={pass} onChange={setPass} placeholder="6+ characters" icon="lock" />
          <Field label="Confirm" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat it" icon="lock" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-ink/60">Daily reading goal</span>
          <div className="flex gap-2 mt-2">
            {[5, 10, 20].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={`flex-1 border-2 border-ink rounded-xl py-2.5 font-display text-lg transition-all cursor-pointer ${goal === g ? "bg-sun shadow-hard-sm -translate-y-0.5" : "bg-cream hover:bg-sun/40"}`}
              >
                {g}
                <span className="block text-[10px] font-body font-bold uppercase tracking-wider text-ink/60">ayahs/day</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-ink/60">First memorization target</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              [1, "Al-Fatihah"],
              [67, "Al-Mulk"],
              [112, "Al-Ikhlas"],
              [97, "Al-Qadr"],
            ].map(([id, n]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTarget(id as number)}
                className={`border-2 border-ink rounded-full px-4 py-1.5 text-sm font-bold transition-all cursor-pointer ${target === id ? "bg-blush shadow-hard-sm" : "bg-cream hover:bg-blush/50"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-sm font-semibold text-burg bg-blush/40 border-2 border-burg/40 rounded-xl px-4 py-2.5">{error}</p>}
        <Btn type="submit" variant="ink" className="w-full py-3.5" disabled={busy}>
          Create my account <Icon name="arrowR" className="w-4 h-4" />
        </Btn>
      </form>
      <p className="text-sm text-center mt-6">
        Already learning?{" "}
        <a href="#/login" className="font-bold text-burg hover:underline">
          Log in
        </a>
      </p>
    </AuthShell>
  );
}

export function ResetPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const send = () => {
    setError("");
    const res = requestReset(email);
    if (!res.ok) {
      setError(res.error || "Could not send code.");
      return;
    }
    setSentCode(res.code || "");
    setStep(2);
  };
  const finish = async () => {
    setError("");
    const res = await doReset(email, code, pass);
    if (!res.ok) setError(res.error || "Reset failed.");
    else setDone(true);
  };

  return (
    <AuthShell title="Reset password" sub="We'll verify it's you with a 6-digit code.">
      {done ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-sun border-2 border-ink grid place-items-center">
            <Icon name="check" className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl uppercase mt-5">Password updated</h2>
          <p className="text-sm text-ink/60 mt-2">You can now log in with your new password.</p>
          <a href="#/login" className="inline-block mt-6">
            <Btn variant="ink">Go to login</Btn>
          </a>
        </div>
      ) : step === 1 ? (
        <div className="space-y-5">
          <Field label="Account email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon="mail" />
          {error && <p className="text-sm font-semibold text-burg bg-blush/40 border-2 border-burg/40 rounded-xl px-4 py-2.5">{error}</p>}
          <Btn variant="ink" className="w-full py-3.5" onClick={send}>
            Send code <Icon name="arrowR" className="w-4 h-4" />
          </Btn>
          <a href="#/login" className="block text-center text-sm font-semibold hover:underline">
            ← Back to login
          </a>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-sun/40 border-2 border-ink rounded-xl px-4 py-3 text-sm">
            <p className="font-bold uppercase tracking-widest text-xs text-ink/60">Demo mailbox</p>
            <p className="mt-1">
              No email server in this demo build — your code is <strong className="font-display text-xl tracking-[0.3em]">{sentCode}</strong>
            </p>
          </div>
          <Field label="6-digit code" value={code} onChange={setCode} placeholder="123456" icon="shield" />
          <Field label="New password" type="password" value={pass} onChange={setPass} placeholder="6+ characters" icon="lock" />
          {error && <p className="text-sm font-semibold text-burg bg-blush/40 border-2 border-burg/40 rounded-xl px-4 py-2.5">{error}</p>}
          <Btn variant="ink" className="w-full py-3.5" onClick={finish}>
            Set new password
          </Btn>
        </div>
      )}
    </AuthShell>
  );
}

function t(k: string) {
  return k === "action.login" ? "Log in" : k;
}
