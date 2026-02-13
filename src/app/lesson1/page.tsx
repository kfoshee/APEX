"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Loader2, Zap, CheckCircle2, XCircle,
  Sparkles, ChevronRight, Database, BarChart3, Layers, Wifi,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DM_Sans } from "next/font/google";
import Image from "next/image";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Msg { role: "user" | "assistant"; content: string }

/* ────────────── CSS RESET ────────────── */
function Reset() {
  return (
    <style jsx global>{`
      *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
      html,body{background:#09090b!important;margin:0!important;padding:0!important;overflow:hidden!important}
      #__next,main,div[data-nextjs-scroll-focus-boundary],
      body>div,body>div>div,body>div>div>div,body>div>div>div>div,
      body>div>div>div>div>div,body>div>div>div>div>div>div{
        margin:0!important;padding:0!important;border:none!important;
        outline:none!important;background:transparent!important}
      [class*="layout"],[class*="Layout"],[class*="container"],[class*="Container"],
      [class*="wrapper"],[class*="Wrapper"],[class*="main"],[class*="Main"]{
        border:none!important;outline:none!important;padding:0!important;margin:0!important}
      nextjs-portal{display:none!important}
    `}</style>
  );
}

/* ────────────── CLIENT-ONLY (prevents hydration mismatch) ────────────── */
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  return ok ? <>{children}</> : null;
}

/* ────────────── FLOATING PARTICLES ────────────── */
function ParticlesCore({ color, n = 16 }: { color: string; n?: number }) {
  const dots = useMemo(
    () => Array.from({ length: n }, (_, i) => ({
      i, x: Math.random() * 100, y: Math.random() * 100,
      s: Math.random() * 3 + 1, d: Math.random() * 8 + 5, w: Math.random() * 4,
    })),
    [n],
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {dots.map((p) => (
        <motion.div key={p.i}
          animate={{ y: [0, -25, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.w, ease: "easeInOut" }}
          style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            width: p.s, height: p.s, borderRadius: "50%", background: color
          }}
        />
      ))}
    </div>
  );
}
function Particles(props: { color: string; n?: number }) {
  return <ClientOnly><ParticlesCore {...props} /></ClientOnly>;
}

/* ────────────── ANIMATED COUNTER ────────────── */
function Counter({ value, pre = "", suf = "", color, sz = "clamp(3.5rem,12vw,7rem)" }:
  { value: number; pre?: string; suf?: string; color: string; sz?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let f: number; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1800, 1);
      setN(Math.round((1 - Math.pow(1 - p, 4)) * value));
      if (p < 1) f = requestAnimationFrame(tick);
    };
    f = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(f);
  }, [value]);
  return (
    <span style={{ fontSize: sz, fontWeight: 900, color, letterSpacing: "-0.04em", lineHeight: 1 }}>
      {pre}{n.toLocaleString()}{suf}
    </span>
  );
}

/* ────────────── CONFETTI ────────────── */
function ConfettiCore() {
  const bits = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({
      i, x: (Math.random() - 0.5) * 600, y: -(Math.random() * 500 + 80),
      r: Math.random() * 720 - 360, sc: Math.random() * 0.7 + 0.3,
      c: ["#ff6b6b", "#ffa64d", "#51cf66", "#4dabf7", "#cc5de8", "#ffd43b"][i % 6],
      dl: Math.random() * 0.2, sh: i % 3,
    })),
    [],
  );
  return (
    <div style={{ position: "fixed", top: "50%", left: "50%", pointerEvents: "none", zIndex: 100 }}>
      {bits.map((b) => (
        <motion.div key={b.i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{ x: b.x, y: b.y, opacity: 0, scale: b.sc, rotate: b.r }}
          transition={{ duration: 1.4, delay: b.dl, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            position: "absolute", width: b.sh === 2 ? 14 : 8,
            height: b.sh === 0 ? 8 : 5, borderRadius: b.sh === 0 ? "50%" : 2,
            background: b.c
          }}
        />
      ))}
    </div>
  );
}
function Confetti() { return <ClientOnly><ConfettiCore /></ClientOnly>; }

/* ────────────── AMBIENT GLOW ────────────── */
function Glow({ color, pos = "tr" }: { color: string; pos?: "tr" | "bl" }) {
  const style = pos === "tr"
    ? { top: "-20%", right: "-10%", width: 700, height: 700 }
    : { bottom: "-20%", left: "-10%", width: 500, height: 500 };
  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1], x: [0, pos === "tr" ? 15 : -10, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "fixed", borderRadius: "50%", pointerEvents: "none",
        opacity: pos === "tr" ? 0.4 : 0.2,
        background: `radial-gradient(circle, ${color}44 0%, transparent 60%)`, ...style
      }}
    />
  );
}

/* ────────────── TEACHING SLIDES ────────────── */
const SLIDE_MS = 4500;

const slides: Slide[] = [
  { kind: "text", title: "Every single click,\nswipe, and search\ncreates data.", sub: "Companies collect billions of data points\nevery day to make smarter decisions.", color: "#ff6b6b", Icon: Wifi },
  { kind: "num", value: 2_500_000_000, pre: "", suf: " GB", label: "of new data created globally every single day.\nThat's 2.5 quintillion bytes.", color: "#ffa64d" },
  { kind: "text", title: "Two kinds\nof data.", sub: "Understanding the difference is the\nfirst thing every analyst learns.", color: "#4dabf7", Icon: Layers },
  { kind: "pair", left: "Spreadsheets\nDatabases\nCSV files\nTransaction logs", right: "Emails\nPhotos\nSocial posts\nVoice memos", ll: "STRUCTURED", rl: "UNSTRUCTURED", ls: "Organized in rows & columns", rs: "No fixed format — 80% of all data", color: "#4dabf7" },
  { kind: "text", title: "Netflix tracks\nthe exact second\nyou stop watching.", sub: "That data decides which shows\nget renewed and which get canceled.", color: "#cc5de8", Icon: BarChart3 },
  { kind: "stat", big: "Episode 5", body: "is where most viewers abandon a series.\nNetflix uses this to reshape entire storylines.", color: "#cc5de8" },
  { kind: "text", title: "Spotify, Uber,\nAmazon — all\ndata companies.", sub: "Every recommendation, route, and price\nis powered by data analysis.", color: "#51cf66", Icon: Database },
  { kind: "num", value: 103_500, pre: "$", suf: "/yr", label: "median data analyst salary in the U.S.\nNo CS degree required.", color: "#51cf66" },
];

type Slide =
  | { kind: "text"; title: string; sub: string; color: string; Icon: any }
  | { kind: "num"; value: number; pre: string; suf: string; label: string; color: string }
  | { kind: "pair"; left: string; right: string; ll: string; rl: string; ls: string; rs: string; color: string }
  | { kind: "stat"; big: string; body: string; color: string };

function slideColor(s: Slide) { return s.color; }
function slideDur(s: Slide) { return s.kind === "num" ? 5200 : s.kind === "pair" ? 5500 : SLIDE_MS; }

/* ────────────── TEXT PARSER ────────────── */
function parseReply(t: string) {
  const lines = t.split("\n");
  const body: string[] = []; const opts: string[] = [];
  for (const l of lines) { if (l.trim().match(/^[A-F]\)\s+.+$/)) opts.push(l.trim()); else body.push(l); }
  while (body.length && !body[body.length - 1].trim()) body.pop();
  return { body: body.join("\n"), opts };
}

function Fmt({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0, m: RegExpExecArray | null, k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) addText(text.slice(last, m.index));
    out.push(<strong key={`b${k++}`} style={{ color: "#fff", fontWeight: 700 }}>{m[1]}</strong>);
    last = re.lastIndex;
  }
  if (last < text.length) addText(text.slice(last));
  function addText(s: string) {
    s.split("\n").forEach((line, i) => {
      if (i > 0) out.push(<br key={`n${k++}`} />);
      out.push(<span key={`t${k++}`}>{line}</span>);
    });
  }
  return <>{out}</>;
}

/* ────────────── ADAPTIVE PROMPT BUILDER ────────────── */
function adaptiveCtx(st: Stats): string {
  const tot = st.correct + st.wrong;
  const acc = tot > 0 ? st.correct / tot : 1;
  let diff = "medium", tone = "encouraging";
  if (acc >= 0.8 && tot >= 3) { diff = "harder"; tone = "push them — they can handle it"; }
  else if (acc < 0.5 && tot >= 2) { diff = "easier"; tone = "supportive, include hints"; }
  const covered = st.topics.length ? `\nTopics already covered: ${st.topics.join(", ")}. Ask about something NEW.` : "";
  return `\n<adaptive_context>
STUDENT STATS: ${st.correct}/${tot} correct (${Math.round(acc * 100)}%). Streak: ${st.streak}.
DIFFICULTY: ${diff}. TONE: ${tone}.${covered}
${diff === "harder" ? "Use inference questions with plausible distractors." : ""}
${diff === "easier" ? "Add a hint. Make wrong answers obviously wrong." : ""}
${st.streak >= 3 ? "Brief streak shoutout (one word like 'Unstoppable.' or 'Flawless.') then next Q." : ""}
Never repeat a topic. Keep progressing.
</adaptive_context>`;
}

interface Stats { correct: number; wrong: number; streak: number; topics: string[] }

/* ══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════ */
export default function Lesson1Page() {
  const router = useRouter();
  const endRef = useRef<HTMLDivElement>(null);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"intro" | "hero" | "teach" | "quiz">("intro");
  const [introStep, setIntroStep] = useState(0);
  const [si, setSi] = useState(0);          // slide index
  const [sk, setSk] = useState(0);          // slide key (for progress bar reset)
  const [picked, setPicked] = useState<string | null>(null);
  const [fb, setFb] = useState<"y" | "n" | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [reveal, setReveal] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ correct: 0, wrong: 0, streak: 0, topics: [] });

  const asstN = msgs.filter((m) => m.role === "assistant").length;
  const prog = Math.min(asstN / 20, 1);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  /* ── Intro: 2 text flashes → hero ── */
  const introTexts = [
    { big: "Data is everywhere.", sub: "Every app. Every company. Every decision." },
    { big: "This is where\nyou start.", sub: "" },
  ];

  useEffect(() => {
    if (phase !== "intro") return;
    // When we've shown both, go to hero
    if (introStep >= introTexts.length) { setPhase("hero"); return; }
    const ms = introStep === 0 ? 3000 : 2800;
    const t = setTimeout(() => setIntroStep((s) => s + 1), ms);
    return () => clearTimeout(t);
  }, [phase, introStep]);

  /* ── Teaching: auto-advance slides → auto quiz ── */
  useEffect(() => {
    if (phase !== "teach") return;
    const dur = slideDur(slides[si]);
    const t = setTimeout(() => {
      if (si < slides.length - 1) { setSi((p) => p + 1); setSk((p) => p + 1); }
      else goQuiz();
    }, dur);
    return () => clearTimeout(t);
  }, [phase, si]);

  /* ── API ── */
  async function api(m: Msg[]) {
    const r = await fetch("/api/tutor", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: m, adaptiveContext: adaptiveCtx(stats) }),
    });
    if (!r.ok) throw new Error(`${r.status}`);
    const d = await r.json();
    if (d.error) throw new Error(d.error);
    return d.message as string;
  }

  async function goQuiz() {
    setPhase("quiz"); setLoading(true);
    const m: Msg = { role: "user", content: "Start Lesson 1.1" };
    try { const r = await api([m]); setMsgs([m, { role: "assistant", content: r }]); }
    catch { setMsgs([m, { role: "assistant", content: "Couldn't connect — check ANTHROPIC_API_KEY." }]); }
    setLoading(false);
  }

  async function answer(text: string) {
    if (!text.trim() || loading) return;
    setPicked(null); setFb(null); setReveal(null);
    const m: Msg = { role: "user", content: text.trim() };
    const all = [...msgs, m]; setMsgs(all); setLoading(true);
    try {
      const reply = await api(all);
      setMsgs([...all, { role: "assistant", content: reply }]);
      const lo = reply.toLowerCase();
      const pos = ["correct", "right", "exactly", "well done", "great job", "nice", "spot on", "nailed", "perfect"].some((w) => lo.includes(w));
      const neg = ["incorrect", "not quite", "wrong", "not correct", "not right", "actually, the answer", "close, but"].some((w) => lo.includes(w));
      if (pos && !neg) {
        setFb("y"); setXp((p) => p + 25); setStreak((p) => p + 1);
        setStats((s) => ({ ...s, correct: s.correct + 1, streak: s.streak + 1 }));
        setConfetti(true); setTimeout(() => setConfetti(false), 1500);
      } else if (neg) {
        setFb("n"); setStreak(0);
        setStats((s) => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
        const m2 = reply.match(/(?:correct answer|answer is|answer was|it's actually|it's) ([A-F])\b/i);
        if (m2) setReveal(m2[1]);
      }
      const topics = reply.match(/netflix|spotify|uber|amazon|structured|unstructured|quantitative|qualitative|insight|information/gi);
      if (topics) setStats((s) => ({ ...s, topics: [...new Set([...s.topics, ...topics.map((t) => t.toLowerCase())])] }));
    } catch { setMsgs([...all, { role: "assistant", content: "Connection error." }]); }
    setLoading(false);
  }

  function pick(opt: string) {
    if (loading || picked) return;
    const l = opt.match(/^([A-F])\)/)?.[1] || opt;
    setPicked(l); setTimeout(() => answer(l), 500);
  }

  const latest = useMemo(() => { const a = msgs.filter((m) => m.role === "assistant"); return a.length ? a[a.length - 1] : null; }, [msgs]);
  const parsed = useMemo(() => (latest ? parseReply(latest.content) : null), [latest]);
  const hasOpts = (parsed?.opts.length ?? 0) > 0;

  /* ──────────── SHARED COMPONENTS ──────────── */
  const NavBar = ({ children }: { children?: React.ReactNode }) => (
    <nav style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, zIndex: 20, position: "relative" }}>
      <motion.button onClick={() => router.push("/")} whileHover={{ x: -3 }}
        style={{ color: "#3f3f46", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
        <ArrowLeft style={{ width: 20, height: 20 }} />
      </motion.button>
      <Image src="/APEX-Final-White.svg?v=100" alt="APEX" width={24} height={24} style={{ height: 24, width: 24 }} priority unoptimized />
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.03em", color: "#52525b" }}>APEX</span>
      <div style={{ flex: 1 }} />
      {children}
    </nav>
  );

  const Shell = ({ children, color = "#ff6b6b" }: { children: React.ReactNode; color?: string }) => (
    <div className={dmSans.className} style={{ position: "fixed", inset: 0, background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Reset />
      <Particles color={`${color}25`} n={14} />
      <Glow color={color} pos="tr" />
      <Glow color={color} pos="bl" />
      {children}
    </div>
  );

  /* ══════════════ PHASE: INTRO ══════════════ */
  if (phase === "intro") {
    const cur = introTexts[Math.min(introStep, introTexts.length - 1)];
    if (introStep >= introTexts.length) return null; // brief flash before hero
    return (
      <Shell>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 32px", zIndex: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div key={introStep}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.7, ease }}
              style={{ textAlign: "center", maxWidth: 700 }}>
              <h1 style={{ fontSize: "clamp(2.8rem,10vw,5.5rem)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, color: "white", margin: "0 0 20px", whiteSpace: "pre-line" }}>
                {cur.big}
              </h1>
              {cur.sub && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  style={{ fontSize: 20, color: "#52525b", fontWeight: 400, margin: 0 }}>
                  {cur.sub}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Shell>
    );
  }

  /* ══════════════ PHASE: HERO ══════════════ */
  if (phase === "hero") {
    return (
      <Shell>
        <NavBar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 32px", paddingBottom: 40, zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }} style={{ textAlign: "center" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 24 }}>
              <span style={{ display: "inline-block", padding: "8px 20px", background: "rgba(255,107,107,0.1)", borderRadius: 100, fontSize: 13, fontWeight: 700, color: "#ff6b6b", letterSpacing: "0.05em" }}>LESSON 1.1</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              style={{ fontSize: "clamp(2.8rem,10vw,5.5rem)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.95, color: "white", margin: "0 0 24px" }}>
              What is data and<br /><span style={{ color: "#ff6b6b" }}>why it matters</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ fontSize: 17, color: "#52525b", margin: "0 0 48px", fontWeight: 400 }}>
              8 concepts &middot; 20 questions &middot; ~15 min
            </motion.p>
            <motion.button initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setPhase("teach"); setSi(0); setSk(0); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#ff6b6b", color: "white", fontSize: 18, fontWeight: 700, padding: "20px 52px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 40px rgba(255,107,107,0.35)" }}>
              Start lesson <ArrowRight style={{ width: 20, height: 20 }} />
            </motion.button>
          </motion.div>
        </div>
      </Shell>
    );
  }

  /* ══════════════ PHASE: TEACH ══════════════ */
  if (phase === "teach") {
    const s = slides[si];
    const c = slideColor(s);
    return (
      <Shell color={c}>
        {/* Instagram-style progress bars */}
        <div style={{ display: "flex", gap: 3, padding: "16px 16px 0", zIndex: 20 }}>
          {slides.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              {i < si && <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.5)" }} />}
              {i === si && (
                <motion.div key={sk} initial={{ width: "0%" }} animate={{ width: "100%" }}
                  transition={{ duration: slideDur(s) / 1000, ease: "linear" }}
                  style={{ height: "100%", background: c }} />
              )}
            </div>
          ))}
        </div>

        {/* Tap left / right */}
        <div onClick={() => { if (si > 0) { setSi((p) => p - 1); setSk((p) => p + 1); } }}
          style={{ position: "fixed", left: 0, top: 50, bottom: 80, width: "25%", zIndex: 15, cursor: "pointer" }} />
        <div onClick={() => { if (si < slides.length - 1) { setSi((p) => p + 1); setSk((p) => p + 1); } else goQuiz(); }}
          style={{ position: "fixed", right: 0, top: 50, bottom: 80, width: "25%", zIndex: 15, cursor: "pointer" }} />

        {/* Slide content */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 32px", zIndex: 10 }}>
          <AnimatePresence mode="wait">
            <motion.div key={si}
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.5, ease }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 620, width: "100%" }}>

              {s.kind === "text" && <>
                <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.1, duration: 0.6, ease }}
                  style={{ width: 68, height: 68, borderRadius: 22, background: `${c}12`, border: `1px solid ${c}28`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
                  <s.Icon style={{ width: 30, height: 30, color: c }} />
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
                  style={{ fontSize: "clamp(2.2rem,8vw,3.8rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, color: "white", margin: "0 0 20px", whiteSpace: "pre-line" }}>
                  {s.title}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  style={{ fontSize: 18, lineHeight: 1.6, color: "#71717a", margin: 0, whiteSpace: "pre-line", maxWidth: 460 }}>
                  {s.sub}
                </motion.p>
              </>}

              {s.kind === "num" && <>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                  <Counter value={s.value} pre={s.pre} suf={s.suf} color={c}
                    sz={s.value > 999999 ? "clamp(2rem,7vw,3.2rem)" : "clamp(3.5rem,12vw,7rem)"} />
                </motion.div>
                <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                  style={{ fontSize: 18, color: "#71717a", margin: "24px 0 0", fontWeight: 400, maxWidth: 420, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {s.label}
                </motion.p>
              </>}

              {s.kind === "pair" && (
                <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 520 }}>
                  <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
                    style={{ flex: 1, background: `${c}08`, border: `1px solid ${c}22`, borderRadius: 20, padding: "22px 18px", textAlign: "left" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: c, letterSpacing: "0.1em", marginBottom: 6 }}>{s.ll}</div>
                    <div style={{ fontSize: 12, color: `${c}88`, marginBottom: 14 }}>{s.ls}</div>
                    <div style={{ fontSize: 16, lineHeight: 2, color: "#a1a1aa", whiteSpace: "pre-line" }}>{s.left}</div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
                    style={{ flex: 1, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "22px 18px", textAlign: "left" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#71717a", letterSpacing: "0.1em", marginBottom: 6 }}>{s.rl}</div>
                    <div style={{ fontSize: 12, color: "#52525b", marginBottom: 14 }}>{s.rs}</div>
                    <div style={{ fontSize: 16, lineHeight: 2, color: "#52525b", whiteSpace: "pre-line" }}>{s.right}</div>
                  </motion.div>
                </div>
              )}

              {s.kind === "stat" && <>
                <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6, ease }}
                  style={{ fontSize: "clamp(3rem,10vw,5.5rem)", fontWeight: 900, color: c, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 20 }}>
                  {s.big}
                </motion.div>
                <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  style={{ fontSize: 18, color: "#71717a", margin: 0, fontWeight: 400, maxWidth: 400, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {s.body}
                </motion.p>
              </>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Skip */}
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            onClick={goQuiz}
            style={{ background: "none", border: "none", color: "#3f3f46", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "8px 16px" }}>
            Skip to quiz
          </motion.button>
        </div>
      </Shell>
    );
  }

  /* ══════════════ PHASE: QUIZ ══════════════ */
  return (
    <Shell>
      {confetti && <Confetti />}

      {/* Top bar */}
      <nav style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, zIndex: 10, background: "rgba(9,9,11,0.95)", backdropFilter: "blur(20px)" }}>
        <motion.button onClick={() => router.push("/")} whileHover={{ x: -3 }}
          style={{ color: "#3f3f46", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}>
          <ArrowLeft style={{ width: 20, height: 20 }} />
        </motion.button>
        <div style={{ flex: 1, height: 5, background: "#18181b", borderRadius: 3, overflow: "hidden" }}>
          <motion.div animate={{ width: `${Math.max(prog * 100, 4)}%` }} transition={{ duration: 0.8, ease }}
            style={{ height: "100%", background: "linear-gradient(90deg,#ff6b6b,#ff8a80)", borderRadius: 3 }} />
        </div>
        <motion.div key={xp} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
          style={{ display: "flex", alignItems: "center", gap: 4, color: "#ffa64d", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
          <Zap style={{ width: 15, height: 15 }} />{xp}
        </motion.div>
        {streak > 1 && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(255,107,107,0.12)", borderRadius: 100, padding: "3px 9px", fontSize: 12, fontWeight: 700, color: "#ff6b6b", flexShrink: 0 }}>
            <Sparkles style={{ width: 12, height: 12 }} />{streak}x
          </motion.div>
        )}
      </nav>

      {/* Questions */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 680, width: "100%", padding: "32px 28px 140px", minHeight: "100%", position: "relative", zIndex: 1 }}>

          <AnimatePresence>
            {fb && !loading && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, marginBottom: 24,
                  background: fb === "y" ? "rgba(81,207,102,0.08)" : "rgba(255,107,107,0.08)",
                  border: `1px solid ${fb === "y" ? "rgba(81,207,102,0.2)" : "rgba(255,107,107,0.2)"}`
                }}>
                {fb === "y"
                  ? <CheckCircle2 style={{ width: 22, height: 22, color: "#51cf66", flexShrink: 0 }} />
                  : <XCircle style={{ width: 22, height: 22, color: "#ff6b6b", flexShrink: 0 }} />}
                <span style={{ fontSize: 15, fontWeight: 600, color: fb === "y" ? "#51cf66" : "#ff6b6b" }}>
                  {fb === "y" ? "+25 XP" : "Not quite"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {parsed && !loading && (
            <motion.div key={`q${asstN}`} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
              style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: hasOpts ? 32 : 16, textAlign: "center" }}>
                <div style={{ fontSize: 21, lineHeight: 1.65, color: "#d4d4d8", fontWeight: 400, letterSpacing: "-0.01em" }}>
                  <Fmt text={parsed.body} />
                </div>
              </div>
              {hasOpts && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                  {parsed.opts.map((opt, i) => {
                    const letter = opt.match(/^([A-F])\)/)?.[1] || "";
                    const text = opt.replace(/^[A-F]\)\s*/, "");
                    const active = picked === letter;
                    const faded = picked !== null && !active;
                    const revealOk = reveal === letter && fb === "n";
                    let bg = "transparent", bc = "rgba(255,255,255,0.06)", bbg = "rgba(255,107,107,0.08)", bco = "#ff6b6b", tc = "#a1a1aa";
                    if (active && fb === "y") { bg = "rgba(81,207,102,0.1)"; bc = "#51cf66"; bbg = "#51cf66"; bco = "#fff"; tc = "#fff"; }
                    else if (active && fb === "n") { bg = "rgba(255,107,107,0.1)"; bc = "#ff6b6b"; bbg = "#ff6b6b"; bco = "#fff"; tc = "#ff6b6b"; }
                    else if (revealOk) { bg = "rgba(81,207,102,0.06)"; bc = "#51cf66"; bbg = "#51cf6688"; bco = "#fff"; tc = "#51cf66"; }
                    else if (active) { bg = "rgba(255,107,107,0.1)"; bc = "#ff6b6b"; bbg = "#ff6b6b"; bco = "#fff"; tc = "#fff"; }
                    return (
                      <motion.button key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: faded && !revealOk ? 0.25 : 1, y: 0 }}
                        transition={{ duration: 0.45, ease, delay: 0.06 + i * 0.07 }}
                        whileHover={!loading && !picked ? { scale: 1.012, x: 3 } : {}}
                        whileTap={!loading && !picked ? { scale: 0.97 } : {}}
                        onClick={() => pick(opt)}
                        disabled={loading || picked !== null}
                        style={{
                          display: "flex", alignItems: "center", gap: 16, width: "100%", padding: "18px 22px", background: bg,
                          border: `1.5px solid ${bc}`, borderRadius: 14, cursor: loading || picked !== null ? "default" : "pointer",
                          fontFamily: "inherit", textAlign: "left", transition: "all 0.2s ease"
                        }}>
                        <span style={{
                          width: 44, height: 44, borderRadius: 12, background: bbg, color: bco,
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, flexShrink: 0, transition: "all 0.2s"
                        }}>
                          {active && fb === "y" ? <CheckCircle2 style={{ width: 20, height: 20 }} /> :
                            active && fb === "n" ? <XCircle style={{ width: 20, height: 20 }} /> :
                              revealOk ? <CheckCircle2 style={{ width: 20, height: 20 }} /> : letter}
                        </span>
                        <span style={{ color: tc, fontSize: 17, lineHeight: 1.45, fontWeight: 500, transition: "color 0.2s" }}>{text}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, margin: "auto" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Loader2 style={{ width: 28, height: 28, color: "#27272a" }} />
              </motion.div>
              <span style={{ fontSize: 14, color: "#27272a", fontWeight: 500 }}>
                {asstN === 0 ? "Preparing..." : "Next question..."}
              </span>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>
      </div>
    </Shell>
  );
}