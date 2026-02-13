"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Zap, CheckCircle2, XCircle, Sparkles, ChevronRight, Database, BarChart3, TrendingUp, DollarSign, Layers, Wifi, Globe, Server } from "lucide-react";
import { useRouter } from "next/navigation";
import { DM_Sans } from "next/font/google";
import Image from "next/image";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
const smooth: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Message { role: "user" | "assistant"; content: string; }

/* ═══ GLOBAL CSS NUKE ═══ */
function Nuke() {
  return <style jsx global>{`
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    html,body{background:#09090b !important;margin:0 !important;padding:0 !important;overflow:hidden !important}
    #__next,main,div[data-nextjs-scroll-focus-boundary],
    body>div,body>div>div,body>div>div>div,body>div>div>div>div,body>div>div>div>div>div,
    body>div>div>div>div>div>div{
      margin:0 !important;padding:0 !important;border:none !important;
      outline:none !important;background:transparent !important;
    }
    [class*="layout"],[class*="Layout"],[class*="container"],[class*="Container"],
    [class*="wrapper"],[class*="Wrapper"],[class*="main"],[class*="Main"]{
      border:none !important;outline:none !important;padding:0 !important;margin:0 !important;
    }
    nextjs-portal{display:none !important}
  `}</style>;
}

/* ═══ ANIMATED COUNTER ═══ */
function Counter({ value, prefix = "", suffix = "", color, size = "clamp(3.5rem,12vw,7rem)" }: { value: number; prefix?: string; suffix?: string; color: string; size?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let f: number; const s = performance.now();
    function t(n: number) { const p = Math.min((n - s) / 1800, 1); setCount(Math.round((1 - Math.pow(1 - p, 4)) * value)); if (p < 1) f = requestAnimationFrame(t); }
    f = requestAnimationFrame(t); return () => cancelAnimationFrame(f);
  }, [value]);
  return <span style={{ fontSize: size, fontWeight: 900, color, letterSpacing: "-0.04em", lineHeight: 1 }}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ═══ PARTICLE FIELD ═══ */
function Particles({ color, count = 20 }: { color: string; count?: number }) {
  const ps = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, dur: Math.random() * 8 + 6, del: Math.random() * 4,
  })), [count]);
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {ps.map(p => <motion.div key={p.id}
      animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
      transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: "easeInOut" }}
      style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: "50%", background: color }}
    />)}
  </div>;
}

/* ═══ CONFETTI ═══ */
function Confetti() {
  const ps = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    id: i, x: (Math.random() - 0.5) * 600, y: -(Math.random() * 500 + 100),
    r: Math.random() * 720 - 360, s: Math.random() * 0.7 + 0.3,
    c: ["#ff6b6b", "#ffa64d", "#51cf66", "#4dabf7", "#cc5de8", "#ffd43b"][i % 6],
    d: Math.random() * 0.2, sh: i % 3,
  })), []);
  return <div style={{ position: "fixed", top: "50%", left: "50%", pointerEvents: "none", zIndex: 100 }}>
    {ps.map(p => <motion.div key={p.id}
      initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
      animate={{ x: p.x, y: p.y, opacity: 0, scale: p.s, rotate: p.r }}
      transition={{ duration: 1.4, delay: p.d, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ position: "absolute", width: p.sh === 2 ? 14 : 8, height: p.sh === 0 ? 8 : 5, borderRadius: p.sh === 0 ? "50%" : 2, background: p.c }}
    />)}
  </div>;
}

/* ═══ TEACHING SLIDES — Instagram Stories style ═══ */

const SLIDE_DURATION = 3200; // ms per slide

const slides = [
  {
    type: "bigtext" as const,
    text: "Every click\nis data.",
    color: "#ff6b6b",
    icon: Wifi,
  },
  {
    type: "counter" as const,
    value: 2500000000,
    prefix: "",
    suffix: "",
    label: "gigabytes created every single day.",
    color: "#ffa64d",
  },
  {
    type: "bigtext" as const,
    text: "Structured\nvs. unstructured.",
    color: "#4dabf7",
    icon: Layers,
  },
  {
    type: "split" as const,
    left: "Spreadsheets\nDatabases\nCSV files",
    right: "Emails\nPhotos\nVoice memos",
    leftLabel: "STRUCTURED",
    rightLabel: "UNSTRUCTURED",
    color: "#4dabf7",
  },
  {
    type: "bigtext" as const,
    text: "Netflix knows\nwhen you quit.",
    color: "#cc5de8",
    icon: BarChart3,
  },
  {
    type: "fact" as const,
    stat: "Episode 5",
    body: "is where most viewers stop watching a series.",
    color: "#cc5de8",
  },
  {
    type: "counter" as const,
    value: 103500,
    prefix: "$",
    suffix: "",
    label: "median data analyst salary.",
    color: "#51cf66",
  },
  {
    type: "bigtext" as const,
    text: "Ready to\nprove it?",
    color: "#ff6b6b",
    icon: TrendingUp,
    isFinal: true,
  },
];

/* ═══ PARSER ═══ */
function parseMsg(text: string) {
  const lines = text.split("\n"); const body: string[] = []; const options: string[] = [];
  for (const line of lines) { if (line.trim().match(/^([A-F])\)\s+(.+)$/)) options.push(line.trim()); else body.push(line); }
  while (body.length && body[body.length - 1].trim() === "") body.pop();
  return { body: body.join("\n"), options };
}

function InlineFormat({ text }: { text: string }) {
  const parts: React.ReactNode[] = []; const re = /\*\*(.+?)\*\*/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) pushText(text.slice(last, m.index));
    parts.push(<strong key={`b${i++}`} style={{ color: "#fff", fontWeight: 700 }}>{m[1]}</strong>);
    last = re.lastIndex;
  }
  if (last < text.length) pushText(text.slice(last));
  function pushText(t: string) {
    t.split("\n").forEach((line, li) => {
      if (li > 0) parts.push(<br key={`br${i++}`} />); parts.push(<span key={`s${i++}`}>{line}</span>);
    });
  }
  return <>{parts}</>;
}

/* ═══ MAIN ═══ */
export default function Lesson1Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"intro" | "teaching" | "lesson">("intro");
  const [introIdx, setIntroIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctLetter, setCorrectLetter] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const asstCount = messages.filter(m => m.role === "assistant").length;
  const progress = Math.min(asstCount / 20, 1);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Intro auto-advance
  useEffect(() => {
    if (phase !== "intro" || introIdx >= 3) return;
    const t = setTimeout(() => setIntroIdx(s => s + 1), introIdx === 0 ? 2800 : 2200);
    return () => clearTimeout(t);
  }, [phase, introIdx]);

  // Teaching slide auto-advance
  useEffect(() => {
    if (phase !== "teaching") return;
    const s = slides[slideIdx];
    if (s.type === "bigtext" && (s as any).isFinal) return; // don't auto-advance final
    const dur = s.type === "counter" ? 4000 : s.type === "split" ? 4000 : SLIDE_DURATION;
    const t = setTimeout(() => {
      if (slideIdx < slides.length - 1) { setSlideIdx(p => p + 1); setSlideKey(p => p + 1); }
    }, dur);
    return () => clearTimeout(t);
  }, [phase, slideIdx]);

  async function callTutor(msgs: Message[]) {
    const res = await fetch("/api/tutor", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: msgs,
        systemOverride: "You are an engaging data analytics tutor. CRITICAL RULES: 1) Keep questions to MAX 2 sentences. 2) Make one sentence context, one sentence the actual question. 3) Use real examples (Netflix, Spotify, Uber, Amazon). 4) Always provide exactly 4 multiple choice options labeled A) B) C) D). 5) Keep each option under 10 words. 6) After the student answers, give brief feedback (1 sentence) then immediately ask the next question."
      })
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const d = await res.json(); if (d.error) throw new Error(d.error); return d.message;
  }

  async function startQuiz() {
    setPhase("lesson"); setLoading(true);
    const first: Message = { role: "user", content: "Start Lesson 1.1. Remember: keep questions to 2 sentences max. One line of context + one question. 4 short answer options." };
    try { const reply = await callTutor([first]); setMessages([first, { role: "assistant", content: reply }]); }
    catch (err) { console.error(err); setMessages([first, { role: "assistant", content: "Couldn't connect. Check ANTHROPIC_API_KEY." }]); }
    setLoading(false);
  }

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setPicked(null); setFeedback(null); setCorrectLetter(null);
    const msg: Message = { role: "user", content: text.trim() };
    const updated = [...messages, msg]; setMessages(updated); setLoading(true);
    try {
      const reply = await callTutor(updated);
      setMessages([...updated, { role: "assistant", content: reply }]);
      const lower = reply.toLowerCase();
      const pos = lower.includes("correct") || lower.includes("right") || lower.includes("exactly") || lower.includes("well done") || lower.includes("great job") || lower.includes("nice");
      const neg = lower.includes("incorrect") || lower.includes("not quite") || lower.includes("wrong") || lower.includes("not correct");
      if (pos && !neg) {
        setFeedback("correct"); setXp(p => p + 25); setStreak(p => p + 1);
        setShowConfetti(true); setTimeout(() => setShowConfetti(false), 1500);
      } else if (neg) {
        setFeedback("incorrect"); setStreak(0);
        const match = reply.match(/correct answer (?:is|was) ([A-F])/i);
        if (match) setCorrectLetter(match[1]);
      }
    } catch { setMessages([...updated, { role: "assistant", content: "Connection error." }]); }
    setLoading(false);
  }

  function pickOption(opt: string) {
    if (loading || picked) return;
    const letter = opt.match(/^([A-F])\)/)?.[1] || opt;
    setPicked(letter); setTimeout(() => send(letter), 500);
  }

  const latest = useMemo(() => { const a = messages.filter(m => m.role === "assistant"); return a.length ? a[a.length - 1] : null; }, [messages]);
  const parsed = useMemo(() => (latest ? parseMsg(latest.content) : null), [latest]);
  const hasOpts = parsed ? parsed.options.length > 0 : false;

  /* ═══ INTRO ═══ */
  if (phase === "intro") {
    const intros = [
      { big: "Data is everywhere.", sub: "Every app. Every company. Every decision." },
      { big: "Companies pay $100K+", sub: "for people who understand it." },
      { big: "This is where\nyou start.", sub: "" },
    ];
    return (
      <div className={dmSans.className} style={{ position: "fixed", inset: 0, background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Nuke />
        <Particles color="#ff6b6b44" count={15} />
        <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "fixed", top: "-30%", right: "-20%", width: 1000, height: 1000, borderRadius: "50%", opacity: 0.4, pointerEvents: "none",
            background: "radial-gradient(circle, rgba(255,107,107,0.2) 0%, transparent 50%)"
          }} />
        <nav style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 12, zIndex: 2 }}>
          <motion.button onClick={() => router.push("/")} whileHover={{ x: -3 }} style={{ color: "#3f3f46", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <ArrowLeft style={{ width: 20, height: 20 }} />
          </motion.button>
          <Image src="/APEX-Final-White.svg?v=100" alt="APEX" width={24} height={24} style={{ height: 24, width: 24 }} priority unoptimized />
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.03em", color: "#52525b" }}>APEX</span>
        </nav>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 32px", paddingBottom: 80, zIndex: 2 }}>
          <AnimatePresence mode="wait">
            {introIdx < 3 ? (
              <motion.div key={introIdx} initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -40, scale: 0.95 }} transition={{ duration: 0.7, ease: smooth }} style={{ textAlign: "center", maxWidth: 700 }}>
                <h1 style={{ fontSize: "clamp(2.8rem, 10vw, 5.5rem)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1.0, color: "white", margin: "0 0 20px", whiteSpace: "pre-line" }}>{intros[introIdx].big}</h1>
                {intros[introIdx].sub && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }} style={{ fontSize: 20, color: "#52525b", fontWeight: 400, margin: 0 }}>{intros[introIdx].sub}</motion.p>}
                {introIdx === 2 && (
                  <motion.button initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => { setPhase("teaching"); setSlideIdx(0); setSlideKey(0); }}
                    style={{ marginTop: 48, display: "inline-flex", alignItems: "center", gap: 10, background: "#ff6b6b", color: "white", fontSize: 18, fontWeight: 700, padding: "20px 48px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 40px rgba(255,107,107,0.35)" }}>
                    Let's go<ArrowRight style={{ width: 20, height: 20 }} />
                  </motion.button>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div style={{ position: "fixed", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 2 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: introIdx === i ? 28 : 6, height: 6, borderRadius: 3, background: introIdx >= i ? "#ff6b6b" : "#1c1c1e", transition: "all 0.4s ease", cursor: "pointer" }} onClick={() => setIntroIdx(i)} />)}
        </div>
      </div>
    );
  }

  /* ═══ TEACHING — Story-style slides ═══ */
  if (phase === "teaching") {
    const slide = slides[slideIdx];
    const isFinal = slide.type === "bigtext" && (slide as any).isFinal;
    const progressPct = ((slideIdx) / (slides.length - 1)) * 100;

    return (
      <div className={dmSans.className} style={{ position: "fixed", inset: 0, background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Nuke />
        <Particles color={`${slide.color}33`} count={12} />

        {/* Glow */}
        <motion.div key={`g${slideIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} transition={{ duration: 0.6 }}
          style={{
            position: "fixed", top: "-20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", pointerEvents: "none",
            background: `radial-gradient(circle, ${slide.color}44 0%, transparent 60%)`
          }} />
        <motion.div key={`g2${slideIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: "fixed", bottom: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", pointerEvents: "none",
            background: `radial-gradient(circle, ${slide.color}22 0%, transparent 60%)`
          }} />

        {/* Story progress bars — like Instagram */}
        <div style={{ display: "flex", gap: 3, padding: "16px 16px 0", zIndex: 20 }}>
          {slides.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              {i < slideIdx ? <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.5)" }} /> :
                i === slideIdx ? <motion.div key={slideKey} initial={{ width: "0%" }} animate={{ width: "100%" }}
                  transition={{ duration: (slide.type === "counter" || slide.type === "split" ? 4 : SLIDE_DURATION / 1000), ease: "linear" }}
                  style={{ height: "100%", background: slide.color }} /> : null}
            </div>
          ))}
        </div>

        {/* Tap zones */}
        {!isFinal && <>
          <div onClick={() => { if (slideIdx > 0) { setSlideIdx(p => p - 1); setSlideKey(p => p + 1); } }} style={{ position: "fixed", left: 0, top: 60, bottom: 100, width: "30%", zIndex: 15, cursor: "pointer" }} />
          <div onClick={() => { if (slideIdx < slides.length - 1) { setSlideIdx(p => p + 1); setSlideKey(p => p + 1); } }} style={{ position: "fixed", right: 0, top: 60, bottom: 100, width: "30%", zIndex: 15, cursor: "pointer" }} />
        </>}

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 32px", zIndex: 10 }}>
          <AnimatePresence mode="wait">
            <motion.div key={slideIdx} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.5, ease: smooth }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 600 }}>

              {slide.type === "bigtext" && <>
                {slide.icon && <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: smooth }}
                  style={{ width: 64, height: 64, borderRadius: 20, background: `${slide.color}15`, border: `1px solid ${slide.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
                  <slide.icon style={{ width: 28, height: 28, color: slide.color }} />
                </motion.div>}
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
                  style={{ fontSize: "clamp(2.5rem, 9vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.045em", lineHeight: 1.05, color: "white", margin: 0, whiteSpace: "pre-line" }}>
                  {slide.text}
                </motion.h1>
                {isFinal && <motion.button initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={startQuiz}
                  style={{ marginTop: 48, display: "inline-flex", alignItems: "center", gap: 10, background: "#ff6b6b", color: "white", fontSize: 18, fontWeight: 700, padding: "20px 52px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 40px rgba(255,107,107,0.4)" }}>
                  Start quiz<ArrowRight style={{ width: 20, height: 20 }} />
                </motion.button>}
              </>}

              {slide.type === "counter" && <>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
                  <Counter value={slide.value!} prefix={slide.prefix} suffix={slide.suffix} color={slide.color!}
                    size={slide.value! > 999999 ? "clamp(2rem,7vw,3.5rem)" : "clamp(3.5rem,12vw,7rem)"} />
                </motion.div>
                <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
                  style={{ fontSize: 19, color: "#71717a", margin: "20px 0 0", fontWeight: 400, maxWidth: 400 }}>
                  {slide.label}
                </motion.p>
              </>}

              {slide.type === "split" && <>
                <div style={{ display: "flex", gap: 20, width: "100%", maxWidth: 500 }}>
                  <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
                    style={{ flex: 1, background: `${slide.color}0a`, border: `1px solid ${slide.color}25`, borderRadius: 20, padding: "24px 20px", textAlign: "left" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: slide.color, letterSpacing: "0.1em", marginBottom: 14 }}>{slide.leftLabel}</div>
                    <div style={{ fontSize: 16, lineHeight: 2, color: "#a1a1aa", whiteSpace: "pre-line" }}>{slide.left}</div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
                    style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "24px 20px", textAlign: "left" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#71717a", letterSpacing: "0.1em", marginBottom: 14 }}>{slide.rightLabel}</div>
                    <div style={{ fontSize: 16, lineHeight: 2, color: "#52525b", whiteSpace: "pre-line" }}>{slide.right}</div>
                  </motion.div>
                </div>
              </>}

              {slide.type === "fact" && <>
                <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6, ease: smooth }}
                  style={{ fontSize: "clamp(3rem,10vw,5.5rem)", fontWeight: 900, color: slide.color, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 16 }}>
                  {slide.stat}
                </motion.div>
                <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
                  style={{ fontSize: 19, color: "#71717a", margin: 0, fontWeight: 400, maxWidth: 380 }}>
                  {slide.body}
                </motion.p>
              </>}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Skip to quiz */}
        {!isFinal && <div style={{ position: "fixed", bottom: 36, left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            onClick={() => { setSlideIdx(slides.length - 1); setSlideKey(p => p + 1); }}
            style={{ background: "none", border: "none", color: "#3f3f46", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "8px 16px" }}>
            Skip to quiz
          </motion.button>
        </div>}
      </div>
    );
  }

  /* ═══ QUIZ ═══ */
  return (
    <div className={dmSans.className} style={{ position: "fixed", inset: 0, background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Nuke />
      {showConfetti && <Confetti />}
      <motion.div style={{
        position: "fixed", top: "-30%", right: "-20%", width: 900, height: 900, borderRadius: "50%", opacity: 0.3, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 50%)"
      }}
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />

      {/* Top bar */}
      <nav style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, zIndex: 10, background: "rgba(9,9,11,0.95)", backdropFilter: "blur(20px)" }}>
        <motion.button onClick={() => router.push("/")} whileHover={{ x: -3 }}
          style={{ color: "#3f3f46", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}>
          <ArrowLeft style={{ width: 20, height: 20 }} />
        </motion.button>
        <div style={{ flex: 1, height: 5, background: "#18181b", borderRadius: 3, overflow: "hidden" }}>
          <motion.div animate={{ width: `${Math.max(progress * 100, 4)}%` }} transition={{ duration: 0.8, ease: smooth }}
            style={{ height: "100%", background: "linear-gradient(90deg, #ff6b6b, #ff8a80)", borderRadius: 3 }} />
        </div>
        <motion.div key={xp} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
          style={{ display: "flex", alignItems: "center", gap: 4, color: "#ffa64d", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
          <Zap style={{ width: 15, height: 15 }} />{xp}
        </motion.div>
        {streak > 1 && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(255,107,107,0.12)", borderRadius: 100, padding: "3px 9px", fontSize: 12, fontWeight: 700, color: "#ff6b6b", flexShrink: 0 }}>
          <Sparkles style={{ width: 12, height: 12 }} />{streak}x
        </motion.div>}
      </nav>

      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: loading ? "center" : "center", maxWidth: 680, width: "100%", padding: "32px 28px 140px", minHeight: "100%", position: "relative", zIndex: 1 }}>

          <AnimatePresence>
            {feedback && !loading && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, marginBottom: 24,
                  background: feedback === "correct" ? "rgba(81,207,102,0.08)" : "rgba(255,107,107,0.08)",
                  border: `1px solid ${feedback === "correct" ? "rgba(81,207,102,0.2)" : "rgba(255,107,107,0.2)"}`
                }}>
                {feedback === "correct" ? <CheckCircle2 style={{ width: 22, height: 22, color: "#51cf66", flexShrink: 0 }} /> : <XCircle style={{ width: 22, height: 22, color: "#ff6b6b", flexShrink: 0 }} />}
                <span style={{ fontSize: 15, fontWeight: 600, color: feedback === "correct" ? "#51cf66" : "#ff6b6b" }}>{feedback === "correct" ? "+25 XP" : "Not quite"}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {parsed && !loading && (
            <motion.div key={`q${asstCount}`} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: smooth }}
              style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: hasOpts ? 32 : 16, textAlign: "center" }}>
                <div style={{ fontSize: 21, lineHeight: 1.65, color: "#d4d4d8", fontWeight: 400, letterSpacing: "-0.01em" }}>
                  <InlineFormat text={parsed.body} />
                </div>
              </div>
              {hasOpts && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                  {parsed.options.map((opt, i) => {
                    const letter = opt.match(/^([A-F])\)/)?.[1] || "";
                    const text = opt.replace(/^[A-F]\)\s*/, "");
                    const isActive = picked === letter;
                    const isFaded = picked !== null && !isActive;
                    const isCorrectReveal = correctLetter === letter && feedback === "incorrect";
                    let bg = "transparent", bc = "rgba(255,255,255,0.06)", bbg = "rgba(255,107,107,0.08)", bco = "#ff6b6b", tc = "#a1a1aa";
                    if (isActive && feedback === "correct") { bg = "rgba(81,207,102,0.1)"; bc = "#51cf66"; bbg = "#51cf66"; bco = "#fff"; tc = "#fff"; }
                    else if (isActive && feedback === "incorrect") { bg = "rgba(255,107,107,0.1)"; bc = "#ff6b6b"; bbg = "#ff6b6b"; bco = "#fff"; tc = "#ff6b6b"; }
                    else if (isCorrectReveal) { bg = "rgba(81,207,102,0.06)"; bc = "#51cf66"; bbg = "#51cf6688"; bco = "#fff"; tc = "#51cf66"; }
                    else if (isActive) { bg = "rgba(255,107,107,0.1)"; bc = "#ff6b6b"; bbg = "#ff6b6b"; bco = "#fff"; tc = "#fff"; }
                    return (
                      <motion.button key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: isFaded && !isCorrectReveal ? 0.25 : 1, y: 0 }}
                        transition={{ duration: 0.45, ease: smooth, delay: 0.06 + i * 0.07 }}
                        whileHover={!loading && !picked ? { scale: 1.012, x: 3 } : {}} whileTap={!loading && !picked ? { scale: 0.97 } : {}}
                        onClick={() => pickOption(opt)} disabled={loading || picked !== null}
                        style={{
                          display: "flex", alignItems: "center", gap: 16, width: "100%", padding: "18px 22px", background: bg,
                          border: `1.5px solid ${bc}`, borderRadius: 14, cursor: loading || picked !== null ? "default" : "pointer",
                          fontFamily: "inherit", textAlign: "left", transition: "all 0.2s ease"
                        }}>
                        <span style={{
                          width: 44, height: 44, borderRadius: 12, background: bbg, color: bco,
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, flexShrink: 0, transition: "all 0.2s"
                        }}>
                          {isActive && feedback === "correct" ? <CheckCircle2 style={{ width: 20, height: 20 }} /> :
                            isActive && feedback === "incorrect" ? <XCircle style={{ width: 20, height: 20 }} /> :
                              isCorrectReveal ? <CheckCircle2 style={{ width: 20, height: 20 }} /> : letter}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, margin: "auto" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Loader2 style={{ width: 28, height: 28, color: "#27272a" }} />
              </motion.div>
              <span style={{ fontSize: 14, color: "#27272a", fontWeight: 500 }}>{asstCount === 0 ? "Preparing..." : "Next question..."}</span>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}