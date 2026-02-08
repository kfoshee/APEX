"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Play,
  RotateCcw,
  Database,
  Sparkles,
  AlertTriangle,
  Users,
  Hash,
  Coffee,
  Lightbulb,
  Award,
  Zap,
  Eye,
  Terminal,
  ArrowRight,
  Clock,
  Flame,
  Trophy,
  RefreshCw,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   1.  DESIGN TOKENS
   ═══════════════════════════════════════════════════════════ */

const T = {
  accent: "#6366f1",
  accentGrad: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
  success: "#10b981",
  error: "#ef4444",
  orange: "#f97316",
  surface: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
  pink: "#ec4899",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  bg: "#09090b",
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  textDim: "#475569",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  font: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

/* ═══════════════════════════════════════════════════════════
   2.  ZOD SCHEMAS  –  versioned, with readable error map
   ═══════════════════════════════════════════════════════════ */

const SCHEMA_VERSION = 2;

const OrderRowSchema = z.object({
  id: z.number(),
  customer: z.string(),
  color: z.string().optional(),
  item: z.string(),
  price: z.string(),
});

const LiveTableVisualSchema = z.object({
  type: z.literal("live_table"),
  orders: z.array(OrderRowSchema),
  revealSpeed: z.number().optional(),
});

const CountDemoVisualSchema = z.object({
  type: z.literal("count_demo"),
  people: z.array(z.object({ name: z.string(), color: z.string() })),
});

const MatchingVisualSchema = z.object({
  type: z.literal("matching"),
  pairs: z.array(z.object({ left: z.string(), right: z.string() })),
  shuffleRight: z.boolean().optional(),
});

const SqlPlaygroundVisualSchema = z.object({
  type: z.literal("sql_playground"),
  defaultQuery: z.string().optional(),
  orders: z.array(OrderRowSchema),
  hint: z.string().optional(),
});

const VisualSchema = z.discriminatedUnion("type", [
  LiveTableVisualSchema,
  CountDemoVisualSchema,
  MatchingVisualSchema,
  SqlPlaygroundVisualSchema,
]);

const QuizOptionSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  correct: z.boolean().optional(),
});

const ChecklistItemSchema = z.object({
  icon: z.string().optional(),
  text: z.string(),
});

const SlideSchema = z.object({
  id: z.string(),
  type: z.enum(["intro", "concept", "quiz", "checkpoint", "summary"]),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  badge: z.string().optional(),
  badgeColor: z.string().optional(),
  badgeIcon: z.string().optional(),
  visual: VisualSchema.optional(),
  options: z.array(QuizOptionSchema).optional(),
  checklist: z.array(ChecklistItemSchema).optional(),
  phases: z.array(z.object({ content: z.string(), delay: z.number().optional() })).optional(),
  autoAdvance: z.boolean().optional(),
  successMessage: z.string().optional(),
  failureMessage: z.string().optional(),
  remediation: z.string().optional(),
});

const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  estimatedMinutes: z.number().optional(),
  slides: z.array(SlideSchema).min(1),
});

type Lesson = z.infer<typeof LessonSchema>;
type Slide = z.infer<typeof SlideSchema>;
type OrderRow = z.infer<typeof OrderRowSchema>;
type Visual = z.infer<typeof VisualSchema>;

function formatZodIssues(err: z.ZodError): string {
  const grouped = new Map<string, string[]>();
  for (const issue of err.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "root";
    const list = grouped.get(path) ?? [];
    list.push(issue.message);
    grouped.set(path, list);
  }
  const parts: string[] = [];
  grouped.forEach((msgs, path) => parts.push(`${path}: ${msgs.join("; ")}`));
  return parts.join(" | ");
}

/* ═══════════════════════════════════════════════════════════
   3.  CACHE  –  versioned with 7-day expiry
   ═══════════════════════════════════════════════════════════ */

const STORAGE_KEY = "apex_lesson1";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface CacheEnvelope {
  v: number;
  savedAt: number;
  lesson: Lesson;
  slideResults: SlideResults;
  slideIdx: number;
}

function saveCache(lesson: Lesson, results: SlideResults, idx: number) {
  try {
    const env: CacheEnvelope = { v: SCHEMA_VERSION, savedAt: Date.now(), lesson, slideResults: results, slideIdx: idx };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(env));
  } catch { /* quota exceeded */ }
}

function loadCache(): { data: CacheEnvelope } | { stale: true } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: CacheEnvelope = JSON.parse(raw);
    if (parsed.v !== SCHEMA_VERSION || Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return { stale: true };
    }
    LessonSchema.parse(parsed.lesson); // validate against current schema
    return { data: parsed };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { stale: true };
  }
}

function clearCache() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}

/* ═══════════════════════════════════════════════════════════
   4.  ANALYTICS
   ═══════════════════════════════════════════════════════════ */

const SESSION_KEY = "apex_session";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem(SESSION_KEY, sid); }
  return sid;
}

function trackEvent(
  event: "lesson_started" | "slide_viewed" | "answer_submitted" | "lesson_completed" | "remediation_shown",
  payload: Record<string, unknown> = {},
) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, sessionId: getSessionId(), timestamp: new Date().toISOString(), ...payload }),
  }).catch(() => { });
}

/* ═══════════════════════════════════════════════════════════
   5.  STATE  –  single reducer, no impossible states
   ═══════════════════════════════════════════════════════════ */

type SlideResult = { attempts: number; correct: boolean; answers: string[]; timeSpentMs: number };
type SlideResults = Record<string, SlideResult>;
type Phase = "upload" | "loading" | "active" | "remediation" | "complete";

interface LessonState {
  phase: Phase;
  lesson: Lesson | null;
  slideIdx: number;
  flash: boolean;
  error: string | null;
  slideResults: SlideResults;
  remediationSlideId: string | null;
  streak: number;
  maxStreak: number;
  elapsedSec: number;
  slideEnteredAt: number;
  cacheStale: boolean;
}

type Action =
  | { type: "START_LOADING" }
  | { type: "LOAD_SUCCESS"; lesson: Lesson; results?: SlideResults; slideIdx?: number }
  | { type: "LOAD_ERROR"; error: string }
  | { type: "CACHE_STALE" }
  | { type: "NEXT_SLIDE" }
  | { type: "PREV_SLIDE" }
  | { type: "ANSWER_SUBMITTED"; slideId: string; correct: boolean; answer: string }
  | { type: "REMEDIATION_DONE" }
  | { type: "CELEBRATE" }
  | { type: "CELEBRATE_END" }
  | { type: "TICK" }
  | { type: "RESTART" };

const INITIAL_STATE: LessonState = {
  phase: "upload",
  lesson: null,
  slideIdx: 0,
  flash: false,
  error: null,
  slideResults: {},
  remediationSlideId: null,
  streak: 0,
  maxStreak: 0,
  elapsedSec: 0,
  slideEnteredAt: Date.now(),
  cacheStale: false,
};

function reducer(state: LessonState, action: Action): LessonState {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, phase: "loading", error: null };

    case "LOAD_SUCCESS":
      return {
        ...state, phase: "active", lesson: action.lesson,
        slideIdx: action.slideIdx ?? 0,
        slideResults: action.results ?? {},
        error: null, slideEnteredAt: Date.now(), cacheStale: false,
      };

    case "LOAD_ERROR":
      return { ...state, phase: "upload", error: action.error };

    case "CACHE_STALE":
      return { ...state, phase: "upload", cacheStale: true, lesson: null };

    case "NEXT_SLIDE": {
      if (!state.lesson) return state;
      const maxIdx = state.lesson.slides.length - 1;
      if (state.slideIdx >= maxIdx) return { ...state, phase: "complete" };
      const now = Date.now();
      const cur = state.lesson.slides[state.slideIdx];
      const prev = state.slideResults[cur.id];
      const updated: SlideResults = {
        ...state.slideResults,
        [cur.id]: { ...(prev ?? { attempts: 0, correct: false, answers: [] }), timeSpentMs: (prev?.timeSpentMs ?? 0) + (now - state.slideEnteredAt) },
      };
      return { ...state, slideIdx: state.slideIdx + 1, slideEnteredAt: now, slideResults: updated };
    }

    case "PREV_SLIDE":
      return state.slideIdx <= 0 ? state : { ...state, slideIdx: state.slideIdx - 1, slideEnteredAt: Date.now() };

    case "ANSWER_SUBMITTED": {
      const prev = state.slideResults[action.slideId];
      const attempts = (prev?.attempts ?? 0) + 1;
      const isCorrect = (prev?.correct ?? false) || action.correct;
      const newStreak = action.correct ? state.streak + 1 : 0;
      const updated: SlideResults = {
        ...state.slideResults,
        [action.slideId]: { attempts, correct: isCorrect, answers: [...(prev?.answers ?? []), action.answer], timeSpentMs: prev?.timeSpentMs ?? 0 },
      };
      if (!action.correct && attempts === 1) {
        return { ...state, slideResults: updated, streak: 0, phase: "remediation", remediationSlideId: action.slideId };
      }
      return { ...state, slideResults: updated, streak: newStreak, maxStreak: Math.max(state.maxStreak, newStreak) };
    }

    case "REMEDIATION_DONE":
      return { ...state, phase: "active", remediationSlideId: null };

    case "CELEBRATE":
      return { ...state, flash: true };

    case "CELEBRATE_END":
      return { ...state, flash: false };

    case "TICK":
      return state.phase === "active" || state.phase === "remediation"
        ? { ...state, elapsedSec: state.elapsedSec + 1 }
        : state;

    case "RESTART":
      clearCache();
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}

/* ═══════════════════════════════════════════════════════════
   6.  SAFE CONTENT RENDERING  (replaces dangerouslySetInnerHTML)
   ═══════════════════════════════════════════════════════════ */

function renderSafe(raw: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const lines = raw.split("\n");
  lines.forEach((line, li) => {
    if (li > 0) nodes.push(<br key={`br-${li}`} />);
    const re = /(\*\*(.+?)\*\*|`(.+?)`)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let ti = 0;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) nodes.push(line.slice(last, m.index));
      if (m[2]) nodes.push(<strong key={`b-${li}-${ti}`} style={{ color: T.textPrimary }}>{m[2]}</strong>);
      else if (m[3]) nodes.push(<code key={`c-${li}-${ti}`} style={{ background: "rgba(99,102,241,0.15)", color: T.accent, padding: "2px 6px", borderRadius: 4, fontSize: "0.9em" }}>{m[3]}</code>);
      last = m.index + m[0].length;
      ti++;
    }
    if (last < line.length) nodes.push(line.slice(last));
  });
  return nodes;
}

/* ═══════════════════════════════════════════════════════════
   7.  ICON MAP
   ═══════════════════════════════════════════════════════════ */

const ICON_MAP: Record<string, React.ElementType> = {
  Eye, Hash, Users, Coffee, Database, Sparkles, Award, Zap, Lightbulb,
  AlertTriangle, Terminal, Check, Play, ArrowRight, Clock, Flame, Trophy,
};

function resolveIcon(name?: string, fallback: React.ElementType = Sparkles): React.ElementType {
  if (!name) return fallback;
  return ICON_MAP[name] ?? fallback;
}

/* ═══════════════════════════════════════════════════════════
   8.  SMALL REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function Badge({ text, color = T.accent, icon }: { text: string; color?: string; icon?: string }) {
  const Icon = resolveIcon(icon);
  return (
    <div style={{ display: "inline-flex", padding: "8px 16px", background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 8, alignItems: "center", gap: 8, marginBottom: 24 }}>
      <Icon size={18} color={color} />
      <span style={{ color, fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" }}>{text}</span>
    </div>
  );
}

function Avatar({ name, color, size = 48, active, excluded, count }: { name: string; color: string; size?: number; active?: boolean; excluded?: boolean; count?: number }) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  return (
    <motion.div animate={{ scale: active ? 1.1 : 1, opacity: excluded ? 0.3 : 1, y: active ? -8 : 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
      <div aria-label={`${name}${excluded ? " (skipped)" : ""}${count ? ` – ${count} orders` : ""}`}
        style={{
          width: size, height: size, borderRadius: size / 3,
          background: excluded ? `${T.error}30` : active ? `${color}30` : "rgba(255,255,255,0.05)",
          border: `3px solid ${excluded ? T.error : active ? color : "rgba(255,255,255,0.1)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.35, fontWeight: 700, color: excluded ? T.error : active ? color : T.textMuted,
        }}>{initials}</div>
      <span style={{ fontSize: 11, fontWeight: 600, color: excluded ? T.error : active ? color : T.textMuted }}>{name}</span>
      {excluded && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: T.error, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={12} color="white" strokeWidth={3} />
        </motion.div>
      )}
      {count !== undefined && !excluded && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: T.success, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white" }}>
          {count}
        </motion.div>
      )}
    </motion.div>
  );
}

function PrimaryBtn({ children, onClick, disabled, full, label }: { children: ReactNode; onClick: () => void; disabled?: boolean; full?: boolean; label?: string }) {
  return (
    <motion.button aria-label={label} whileHover={disabled ? {} : { scale: 1.02 }} whileTap={disabled ? {} : { scale: 0.98 }} onClick={onClick} disabled={disabled}
      style={{ width: full ? "100%" : "auto", padding: "14px 32px", background: disabled ? "rgba(255,255,255,0.1)" : T.accentGrad, border: "none", borderRadius: 12, color: "white", fontSize: 16, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
      {children}
    </motion.button>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <motion.div initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: `${T.orange}20`, border: `1px solid ${T.orange}40`, fontSize: 12, fontWeight: 700, color: T.orange }}>
      <Flame size={13} /> {streak} streak
    </motion.div>
  );
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ═══════════════════════════════════════════════════════════
   9.  VISUAL: LIVE TABLE
   ═══════════════════════════════════════════════════════════ */

function VisualLiveTable({ visual, onComplete }: { visual: z.infer<typeof LiveTableVisualSchema>; onComplete?: () => void }) {
  const { orders, revealSpeed = 600 } = visual;
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const start = () => {
    setRunning(true); setStep(0);
    let i = 0;
    const iv = setInterval(() => { i++; setStep(i); if (i >= orders.length) { clearInterval(iv); onComplete?.(); } }, revealSpeed);
  };

  const visible = orders.slice(0, step);
  const unique = [...new Set(visible.map((o) => o.customer))];

  return (
    <div>
      <div role="region" aria-label="Customer avatars" style={{ display: "flex", justifyContent: "center", gap: 24, padding: "24px 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 16 }}>
        {unique.length === 0
          ? <div style={{ color: T.textDim, fontSize: 14, padding: 20 }}>Customers will appear here…</div>
          : unique.map((name) => {
            const o = orders.find((x) => x.customer === name);
            const ct = visible.filter((x) => x.customer === name).length;
            return <motion.div key={name} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }}><Avatar name={name} color={o?.color ?? T.accent} size={56} active count={ct} /></motion.div>;
          })}
      </div>

      <div role="table" aria-label="Orders" style={{ background: "#0c0c0f", border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 24, minHeight: 180 }}>
        <div role="row" style={{ display: "grid", gridTemplateColumns: "60px 1fr 1.2fr 80px", borderBottom: `1px solid ${T.border}` }}>
          {["#", "Customer", "Item", "Price"].map((h) => (
            <div key={h} role="columnheader" style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
          ))}
        </div>
        <div style={{ padding: 8 }}>
          {visible.map((o) => (
            <motion.div key={o.id} role="row" initial={{ opacity: 0, x: -20, backgroundColor: `${o.color ?? T.accent}20` }} animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
              style={{ display: "grid", gridTemplateColumns: "60px 1fr 1.2fr 80px", padding: "10px 12px", borderRadius: 8 }}>
              <div style={{ fontFamily: "monospace", fontSize: 13, color: T.textMuted }}>{o.id}</div>
              <div style={{ fontSize: 14, color: o.color ?? T.accent, fontWeight: 600 }}>{o.customer}</div>
              <div style={{ fontSize: 14, color: T.textSecondary }}>{o.item}</div>
              <div style={{ fontSize: 14, color: T.textSecondary, fontFamily: "monospace" }}>{o.price}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {step > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: "white" }}>{step}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>orders</div>
          </div>
          <div style={{ flex: 1, padding: 16, background: `${T.success}10`, border: `1px solid ${T.success}30`, borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: T.success }}>{unique.length}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>unique people</div>
          </div>
        </motion.div>
      )}

      {!running && <PrimaryBtn onClick={start} full label="Play order animation"><Play size={20} fill="white" /> Watch Orders</PrimaryBtn>}

      {step >= orders.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "16px 20px", background: `${T.yellow}10`, border: `1px solid ${T.yellow}30`, borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <Lightbulb size={22} color={T.yellow} />
          <span style={{ color: "#fef08a", fontSize: 15 }}>Notice: <strong>{orders.length} orders</strong>, but only <strong>{unique.length} different people</strong></span>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   10. VISUAL: COUNT DEMO
   ═══════════════════════════════════════════════════════════ */

function VisualCountDemo({ visual, onComplete }: { visual: z.infer<typeof CountDemoVisualSchema>; onComplete?: () => void }) {
  const { people } = visual;
  const [mode, setMode] = useState<"idle" | "running" | "done">("idle");
  const [step, setStep] = useState(0);
  const [excluded, setExcluded] = useState<number[]>([]);
  const [result, setResult] = useState(0);

  const run = () => {
    setMode("running"); setStep(0); setExcluded([]); setResult(0);
    const seen = new Set<string>();
    let i = 0;
    const iv = setInterval(() => {
      if (i < people.length) {
        setStep(i + 1);
        if (seen.has(people[i].name)) setExcluded((p) => [...p, i]);
        else { seen.add(people[i].name); setResult(seen.size); }
        i++;
      } else { clearInterval(iv); setMode("done"); onComplete?.(); }
    }, 700);
  };

  return (
    <div>
      <div role="region" aria-label="Count distinct demo" style={{ display: "flex", justifyContent: "center", gap: 16, padding: "32px 20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {people.map((p, i) => <Avatar key={i} name={p.name} color={p.color} size={52} active={i < step && !excluded.includes(i)} excluded={excluded.includes(i)} />)}
      </div>

      {mode !== "idle" && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div aria-live="polite" style={{ padding: "24px 56px", background: `${T.success}15`, border: `2px solid ${T.success}`, borderRadius: 20, textAlign: "center" }}>
            <motion.div key={result} initial={{ scale: 1.3 }} animate={{ scale: 1 }} style={{ fontSize: 64, fontWeight: 800, color: T.success }}>{result}</motion.div>
            <div style={{ color: "#6ee7b7", fontSize: 14 }}>unique customers</div>
          </div>
        </motion.div>
      )}

      {mode !== "idle" && step >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24, fontSize: 13, color: T.textSecondary }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 4, background: T.success }} /> Counted</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 4, background: T.error }} /> Skipped (duplicate)</div>
        </motion.div>
      )}

      {mode === "idle" && <PrimaryBtn onClick={run} full label="Run count distinct"><Play size={20} fill="white" /> Run COUNT(DISTINCT customer)</PrimaryBtn>}

      {mode === "done" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "16px 20px", background: `${T.success}10`, border: `1px solid ${T.success}30`, borderRadius: 12, textAlign: "center", color: "#6ee7b7", fontSize: 15 }}>
          Duplicates were each counted only <strong>once</strong>.
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   11. VISUAL: MATCHING
   ═══════════════════════════════════════════════════════════ */

function VisualMatching({ visual, onComplete }: { visual: z.infer<typeof MatchingVisualSchema>; onComplete?: () => void }) {
  const { pairs, shuffleRight = true } = visual;
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({});
  const [wrong, setWrong] = useState<number | null>(null);

  const rightOrder = useMemo(() => {
    if (!shuffleRight) return pairs.map((_, i) => i);
    const arr = pairs.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }, [pairs.length, shuffleRight]); // eslint-disable-line react-hooks/exhaustive-deps

  const matchedRights = new Set(Object.values(matched));
  const done = Object.keys(matched).length === pairs.length;

  useEffect(() => { if (done) onComplete?.(); }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRight = (ri: number) => {
    if (selectedLeft === null || matchedRights.has(ri)) return;
    if (ri === selectedLeft) { setMatched((m) => ({ ...m, [selectedLeft]: ri })); setSelectedLeft(null); }
    else { setWrong(ri); setTimeout(() => setWrong(null), 600); setSelectedLeft(null); }
  };

  return (
    <div>
      <div role="region" aria-label="Matching exercise" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pairs.map((p, i) => {
            const im = i in matched; const isSel = selectedLeft === i;
            return (
              <motion.button key={`l-${i}`} aria-label={`Concept: ${p.left}`} whileHover={!im ? { scale: 1.02 } : {}} onClick={() => !im && setSelectedLeft(i)}
                style={{ padding: "14px 16px", borderRadius: 12, textAlign: "left", background: im ? `${T.success}15` : isSel ? `${T.accent}20` : T.surface, border: `2px solid ${im ? T.success : isSel ? T.accent : T.border}`, cursor: im ? "default" : "pointer", color: "white", fontSize: 14, fontWeight: 500 }}>
                {im && <Check size={14} color={T.success} style={{ marginRight: 8 }} />}{p.left}
              </motion.button>);
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rightOrder.map((ri) => {
            const im = matchedRights.has(ri); const iw = wrong === ri;
            return (
              <motion.button key={`r-${ri}`} aria-label={`Definition: ${pairs[ri].right}`} animate={iw ? { x: [0, -6, 6, -6, 0] } : {}} whileHover={!im ? { scale: 1.02 } : {}} onClick={() => handleRight(ri)}
                style={{ padding: "14px 16px", borderRadius: 12, textAlign: "left", background: im ? `${T.success}15` : iw ? `${T.error}20` : T.surface, border: `2px solid ${im ? T.success : iw ? T.error : T.border}`, cursor: im ? "default" : "pointer", color: "white", fontSize: 14, fontWeight: 500 }}>
                {pairs[ri].right}
              </motion.button>);
          })}
        </div>
      </div>
      {done && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20, padding: "16px 20px", background: `${T.success}10`, border: `1px solid ${T.success}30`, borderRadius: 12, textAlign: "center", color: "#6ee7b7", fontSize: 15 }}>
          <Check size={16} style={{ marginRight: 6, verticalAlign: "middle" }} /> All matched correctly!
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   12. VISUAL: SQL PLAYGROUND  –  presets · hints · explanations
   ═══════════════════════════════════════════════════════════ */

type SqlOk = { ok: true; columns: string[]; rows: (string | number)[][]; explanation: string };
type SqlErr = { ok: false; error: string; hint?: string };
type SqlResult = SqlOk | SqlErr;

function executeSafeSQL(raw: string, orders: OrderRow[]): SqlResult {
  const sql = raw.trim().replace(/;$/, "").replace(/\s+/g, " ").toLowerCase();
  if (/^select\s+count\(\s*\*\s*\)\s+from\s+orders$/.test(sql))
    return { ok: true, columns: ["count"], rows: [[orders.length]], explanation: `COUNT(*) counted every row — all ${orders.length} orders, including repeat customers.` };
  if (/^select\s+count\(\s*distinct\s+customer\s*\)\s+from\s+orders$/.test(sql)) {
    const u = new Set(orders.map((o) => o.customer));
    return { ok: true, columns: ["count"], rows: [[u.size]], explanation: `COUNT(DISTINCT customer) found ${u.size} unique people, ignoring ${orders.length - u.size} duplicate rows.` };
  }
  if (/customer_id/.test(sql)) return { ok: false, error: "Column not found: customer_id", hint: 'The column is called "customer", not "customer_id". Try: SELECT COUNT(DISTINCT customer) FROM orders' };
  if (/select\s+\*/.test(sql)) return { ok: false, error: "SELECT * is not supported here.", hint: "Try COUNT(*) or COUNT(DISTINCT customer) instead." };
  return { ok: false, error: "Query not supported in this sandbox.", hint: "Try:\n• SELECT COUNT(*) FROM orders\n• SELECT COUNT(DISTINCT customer) FROM orders" };
}

const SQL_PRESETS = [
  { label: "COUNT(*)", query: "SELECT COUNT(*) FROM orders;" },
  { label: "COUNT(DISTINCT)", query: "SELECT COUNT(DISTINCT customer) FROM orders;" },
];

function VisualSqlPlayground({ visual, onComplete }: { visual: z.infer<typeof SqlPlaygroundVisualSchema>; onComplete?: () => void }) {
  const { orders, defaultQuery = "", hint } = visual;
  const [query, setQuery] = useState(defaultQuery);
  const [result, setResult] = useState<SqlResult | null>(null);
  const [hasRunDistinct, setHasRunDistinct] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const run = useCallback(() => {
    const res = executeSafeSQL(query, orders);
    setResult(res);
    trackEvent("answer_submitted", { visual: "sql_playground", query: query.trim() });
    if (res.ok && /distinct/i.test(query) && !hasRunDistinct) { setHasRunDistinct(true); onComplete?.(); }
  }, [query, orders, hasRunDistinct, onComplete]);

  const handleKey = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); run(); }
    if (e.key === "Escape") taRef.current?.blur();
  };

  return (
    <div>
      {/* Data preview */}
      <div style={{ marginBottom: 16, padding: 16, background: "#0c0c0f", border: `1px solid ${T.border}`, borderRadius: 12, overflow: "auto", maxHeight: 180 }}>
        <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
          <Database size={12} style={{ marginRight: 6, verticalAlign: "middle" }} /> orders table ({orders.length} rows)
        </div>
        <table role="table" aria-label="Sample data" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr>{["id", "customer", "item", "price"].map((h) => <th key={h} style={{ textAlign: "left", padding: "4px 8px", color: T.textMuted, fontWeight: 600, borderBottom: `1px solid ${T.border}`, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{orders.map((o) => (
            <tr key={o.id}>
              <td style={{ padding: "4px 8px", color: T.textMuted, fontFamily: "monospace" }}>{o.id}</td>
              <td style={{ padding: "4px 8px", color: o.color ?? T.accent, fontWeight: 600 }}>{o.customer}</td>
              <td style={{ padding: "4px 8px", color: T.textSecondary }}>{o.item}</td>
              <td style={{ padding: "4px 8px", color: T.textSecondary, fontFamily: "monospace" }}>{o.price}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Presets */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: T.textDim, lineHeight: "28px" }}>Presets:</span>
        {SQL_PRESETS.map((p) => (
          <button key={p.label} aria-label={`Use preset: ${p.label}`} onClick={() => { setQuery(p.query); setResult(null); taRef.current?.focus(); }}
            style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.surface, color: T.accent, fontSize: 12, fontFamily: T.mono, cursor: "pointer" }}>{p.label}</button>
        ))}
      </div>

      {/* Editor */}
      <div style={{ borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 16, background: "#0c0c0f" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: `1px solid ${T.border}`, background: "rgba(255,255,255,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMuted }}><Terminal size={14} /> SQL Editor</div>
          <span style={{ fontSize: 11, color: T.textDim }}>⌘+Enter to run · Esc to blur</span>
        </div>
        <textarea ref={taRef} aria-label="SQL query editor" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKey} spellCheck={false} rows={3}
          style={{ width: "100%", padding: "14px 16px", background: "transparent", border: "none", color: T.accent, fontFamily: T.mono, fontSize: 14, resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }} />
      </div>

      {hint && !result && <div style={{ marginBottom: 16, fontSize: 13, color: T.textDim, fontStyle: "italic" }}>💡 {hint}</div>}

      <PrimaryBtn onClick={run} full label="Run SQL query"><Play size={18} /> Run Query</PrimaryBtn>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20 }}>
          {!result.ok ? (
            <div role="alert" style={{ padding: 20, background: `${T.error}10`, border: `1px solid ${T.error}40`, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <AlertTriangle size={18} color={T.error} />
                <span style={{ color: T.error, fontWeight: 700 }}>{result.error}</span>
              </div>
              {result.hint && <pre style={{ color: "#fca5a5", fontSize: 13, margin: 0, whiteSpace: "pre-wrap", fontFamily: T.mono, lineHeight: 1.6 }}>{result.hint}</pre>}
            </div>
          ) : (
            <div>
              <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${T.success}40`, marginBottom: 12 }}>
                <div style={{ padding: "8px 14px", background: `${T.success}15`, fontSize: 12, fontWeight: 600, color: T.success, display: "flex", alignItems: "center", gap: 6 }}><Check size={14} /> Result</div>
                <table role="table" aria-label="Query result" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{result.columns.map((c) => <th key={c} style={{ textAlign: "left", padding: "10px 16px", background: "rgba(255,255,255,0.03)", color: T.textMuted, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${T.border}` }}>{c}</th>)}</tr></thead>
                  <tbody>{result.rows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: "12px 16px", color: "white", fontSize: 24, fontWeight: 700, fontFamily: "monospace" }}>{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <div style={{ padding: "12px 16px", background: `${T.accent}08`, border: `1px solid ${T.accent}20`, borderRadius: 10, fontSize: 14, color: T.textSecondary, lineHeight: 1.6 }}>
                <Lightbulb size={14} color={T.accent} style={{ marginRight: 8, verticalAlign: "middle" }} />{result.explanation}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   13. VISUAL DISPATCHER
   ═══════════════════════════════════════════════════════════ */

function VisualRenderer({ visual, onComplete }: { visual: Visual; onComplete?: () => void }) {
  switch (visual.type) {
    case "live_table": return <VisualLiveTable visual={visual} onComplete={onComplete} />;
    case "count_demo": return <VisualCountDemo visual={visual} onComplete={onComplete} />;
    case "matching": return <VisualMatching visual={visual} onComplete={onComplete} />;
    case "sql_playground": return <VisualSqlPlayground visual={visual} onComplete={onComplete} />;
    default: return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   14–17. SLIDE TYPES
   ═══════════════════════════════════════════════════════════ */

function SlideIntro({ slide }: { slide: Slide }) {
  const phases = slide.phases ?? [];
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!phases.length) { setPhase(1); return; }
    const ts = phases.map((p, i) => setTimeout(() => setPhase(i + 1), p.delay ?? (i + 1) * 1200));
    return () => ts.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ maxWidth: 500, textAlign: "center" }}>
      {slide.badge && <Badge text={slide.badge} color={slide.badgeColor} icon={slide.badgeIcon} />}
      <AnimatePresence mode="wait">
        {phases.length > 0 && phase === 0 && (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: 60 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid transparent", borderTopColor: T.accent, margin: "0 auto" }} />
          </motion.div>
        )}
        {phases.map((p, i) => phase === i + 1 && i < phases.length - 1 && (
          <motion.div key={`phase-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ minHeight: 120 }}>
            <p style={{ color: "white", fontSize: 20, lineHeight: 1.6 }}>{renderSafe(p.content)}</p>
          </motion.div>
        ))}
        {(phases.length === 0 || phase >= phases.length) && (
          <motion.div key="final" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {phases.length > 0 && <p style={{ color: T.textSecondary, fontSize: 17, lineHeight: 1.7, marginBottom: 24 }}>{renderSafe(phases[phases.length - 1].content)}</p>}
            {slide.title && <h2 style={{ fontSize: 32, fontWeight: 700, color: "white", marginBottom: 20, lineHeight: 1.3 }}>{renderSafe(slide.title)}</h2>}
            {slide.body && <p style={{ color: T.textMuted, fontSize: 17, lineHeight: 1.7 }}>{renderSafe(slide.body)}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SlideConcept({ slide, onComplete }: { slide: Slide; onComplete?: () => void }) {
  const [expanded, setExpanded] = useState(!slide.visual);
  return (
    <div style={{ maxWidth: 520 }}>
      {slide.badge && <Badge text={slide.badge} color={slide.badgeColor} icon={slide.badgeIcon} />}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {slide.title && <h2 style={{ fontSize: 28, fontWeight: 700, color: "white", marginBottom: 16, lineHeight: 1.3 }}>{renderSafe(slide.title)}</h2>}
        {slide.body && <p style={{ color: T.textSecondary, fontSize: 17, lineHeight: 1.8, marginBottom: 28 }}>{renderSafe(slide.body)}</p>}
      </motion.div>
      {slide.visual && !expanded && <PrimaryBtn onClick={() => setExpanded(true)}>{slide.subtitle ?? "Show me"} <ChevronRight size={18} /></PrimaryBtn>}
      {slide.visual && expanded && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><VisualRenderer visual={slide.visual} onComplete={onComplete} /></motion.div>}
    </div>
  );
}

function SlideQuiz({ slide, onComplete, onAnswer, pastResult }: { slide: Slide; onComplete?: () => void; onAnswer?: (correct: boolean, answer: string) => void; pastResult?: SlideResult }) {
  const options = slide.options ?? [];
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const alreadyCorrect = pastResult?.correct ?? false;

  const handleSelect = (i: number) => {
    if (revealed || alreadyCorrect) return;
    setSelected(i); setTimeout(() => setRevealed(true), 400);
    const opt = options[i]; const correct = !!opt.correct;
    trackEvent("answer_submitted", { slideId: slide.id, slideType: "quiz", answer: String(opt.value), correct, attempt: (pastResult?.attempts ?? 0) + 1 });
    onAnswer?.(correct, String(opt.value));
    if (correct) setTimeout(() => onComplete?.(), 1000);
  };

  return (
    <div style={{ maxWidth: 500 }}>
      {slide.badge && <Badge text={slide.badge} color={slide.badgeColor} icon={slide.badgeIcon} />}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {slide.title && <h2 style={{ fontSize: 26, fontWeight: 700, color: "white", marginBottom: 12 }}>{slide.title}</h2>}
        {slide.subtitle && <p style={{ color: "white", fontSize: 18, fontStyle: "italic", marginBottom: 8 }}>{slide.subtitle}</p>}
        {slide.body && <p style={{ color: T.textMuted, fontSize: 15, marginBottom: 28 }}>{renderSafe(slide.body)}</p>}
      </motion.div>
      <div role="radiogroup" aria-label="Quiz options" style={{ display: "flex", flexDirection: options.length <= 2 ? "row" : "column", gap: 12, marginBottom: 24 }}>
        {options.map((opt, i) => {
          const isC = opt.correct; const isSel = i === selected; const show = revealed || alreadyCorrect; const two = options.length <= 2;
          return (
            <motion.button key={i} role="radio" aria-checked={isSel} aria-label={opt.label} whileHover={!show ? { borderColor: "rgba(255,255,255,0.2)" } : {}} onClick={() => handleSelect(i)}
              style={{
                flex: two ? 1 : undefined, padding: two ? "28px 20px" : "20px", borderRadius: 14, textAlign: two ? "center" : "left",
                background: show && isC ? `${T.success}15` : show && isSel && !isC ? `${T.error}15` : T.surface,
                border: `2px solid ${show && isC ? T.success : show && isSel && !isC ? T.error : T.border}`, cursor: show ? "default" : "pointer"
              }}>
              {two ? (<><div style={{ fontSize: 48, fontWeight: 800, marginBottom: 8, color: show && isC ? T.success : show && isSel && !isC ? T.error : isSel ? T.accent : "white" }}>{opt.value}</div><div style={{ color: T.textSecondary, fontSize: 14 }}>{opt.label}</div></>) :
                (<code style={{ fontSize: 15, color: show && isC ? T.success : show && isSel && !isC ? T.error : "white" }}>{opt.label}</code>)}
              {show && isC && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: T.success, fontSize: 14 }}><Check size={18} /> {slide.successMessage ?? "Correct!"}</motion.div>}
              {show && isSel && !isC && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: T.error, fontSize: 14 }}><X size={18} /> {slide.failureMessage ?? "Not quite"}</motion.div>}
            </motion.button>
          );
        })}
      </div>
      {slide.visual && revealed && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><VisualRenderer visual={slide.visual} onComplete={onComplete} /></motion.div>}
    </div>
  );
}

function SlideCheckpoint({ slide, onComplete }: { slide: Slide; onComplete?: () => void }) {
  return (
    <div style={{ maxWidth: 540 }}>
      {slide.badge && <Badge text={slide.badge} color={slide.badgeColor} icon={slide.badgeIcon} />}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {slide.title && <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>{slide.title}</h2>}
        {slide.body && <p style={{ color: T.textMuted, fontSize: 15, marginBottom: 24 }}>{renderSafe(slide.body)}</p>}
      </motion.div>
      {slide.visual && <VisualRenderer visual={slide.visual} onComplete={onComplete} />}
    </div>
  );
}

function SlideSummary({ slide, stats }: { slide: Slide; stats: { streak: number; maxStreak: number; elapsedSec: number; results: SlideResults } }) {
  const items = slide.checklist ?? [];
  const totalQ = Object.values(stats.results).filter((r) => r.attempts > 0).length;
  const firstTry = Object.values(stats.results).filter((r) => r.correct && r.attempts === 1).length;

  return (
    <div style={{ textAlign: "center", maxWidth: 460 }}>
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 10 }}
        style={{ width: 88, height: 88, borderRadius: 28, background: `linear-gradient(135deg, ${T.success} 0%, #059669 100%)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", boxShadow: `0 20px 50px ${T.success}50` }}>
        <Award size={44} color="white" />
      </motion.div>
      {slide.title && <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: 36, fontWeight: 800, color: "white", marginBottom: 12 }}>{slide.title}</motion.h2>}
      {slide.body && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: T.textSecondary, fontSize: 17, marginBottom: 32, lineHeight: 1.7 }}>{renderSafe(slide.body)}</motion.p>}

      {/* Stats row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} style={{ display: "flex", gap: 12, marginBottom: 28, justifyContent: "center" }}>
        {[
          { icon: Clock, value: fmtTime(stats.elapsedSec), label: "Time", color: T.blue },
          { icon: Flame, value: String(stats.maxStreak), label: "Best streak", color: T.orange },
          { icon: Trophy, value: totalQ > 0 ? `${firstTry}/${totalQ}` : "—", label: "First try", color: T.success },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "14px 8px", background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 12, textAlign: "center" }}>
            <s.icon size={16} color={s.color} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {items.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ padding: 28, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, textAlign: "left" }}>
          <div style={{ color: T.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Your new mental checklist</div>
          {items.map((item, i) => {
            const Icon = resolveIcon(item.icon, Check);
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={18} color={T.accent} /></div>
                <span style={{ color: "white", fontSize: 16, fontWeight: 500 }}>{item.text}</span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   18. REMEDIATION OVERLAY
   ═══════════════════════════════════════════════════════════ */

function RemediationOverlay({ slide, onDismiss }: { slide: Slide; onDismiss: () => void }) {
  const hint = slide.remediation ?? "Let's review. Think about what one row in this table represents, then try again.";
  useEffect(() => { trackEvent("remediation_shown", { slideId: slide.id }); }, [slide.id]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
        style={{ maxWidth: 420, width: "100%", background: "#111114", border: `1px solid ${T.orange}40`, borderRadius: 20, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.orange}20`, display: "flex", alignItems: "center", justifyContent: "center" }}><RefreshCw size={22} color={T.orange} /></div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>Not quite — let's review</div>
            <div style={{ fontSize: 13, color: T.textMuted }}>Everyone misses sometimes</div>
          </div>
        </div>
        <p style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{renderSafe(hint)}</p>
        {slide.visual && <div style={{ marginBottom: 24 }}><VisualRenderer visual={slide.visual} /></div>}
        <PrimaryBtn onClick={onDismiss} full label="Continue after review">Got it — continue <ArrowRight size={18} /></PrimaryBtn>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   19. MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function Lesson1Page() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { phase, lesson, slideIdx, flash, error, slideResults, remediationSlideId, streak, maxStreak, elapsedSec, cacheStale } = state;

  /* ── Restore from cache ── */
  useEffect(() => {
    const c = loadCache();
    if (!c) return;
    if ("stale" in c) { dispatch({ type: "CACHE_STALE" }); return; }
    dispatch({ type: "LOAD_SUCCESS", lesson: c.data.lesson, results: c.data.slideResults, slideIdx: c.data.slideIdx });
    trackEvent("lesson_started", { lessonId: c.data.lesson.id, source: "cache" });
  }, []);

  /* ── Persist cache ── */
  useEffect(() => { if (lesson && phase === "active") saveCache(lesson, slideResults, slideIdx); }, [lesson, slideResults, slideIdx, phase]);

  /* ── Slide analytics ── */
  useEffect(() => {
    if (!lesson || phase !== "active") return;
    const s = lesson.slides[slideIdx];
    if (s) trackEvent("slide_viewed", { lessonId: lesson.id, slideId: s.id, slideType: s.type, slideIndex: slideIdx });
  }, [slideIdx, lesson, phase]);

  /* ── Timer ── */
  useEffect(() => {
    if (phase !== "active" && phase !== "remediation") return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [phase]);

  /* ── Keyboard nav (safe: skip when typing) ── */
  const next = useCallback(() => dispatch({ type: "NEXT_SLIDE" }), []);
  const prev = useCallback(() => dispatch({ type: "PREV_SLIDE" }), []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT") return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  /* ── Start lesson ── */
  const start = async () => {
    if (!file && text.length < 50) return;
    dispatch({ type: "START_LOADING" });
    try {
      const form = new FormData();
      if (file) form.append("resumeFile", file); else form.append("resumeText", text);
      const res = await fetch("/api/lesson1", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      const validated = LessonSchema.parse(json);
      dispatch({ type: "LOAD_SUCCESS", lesson: validated });
      trackEvent("lesson_started", { lessonId: validated.id, source: "fresh" });
    } catch (e: unknown) {
      if (e instanceof z.ZodError) dispatch({ type: "LOAD_ERROR", error: `Invalid lesson data: ${formatZodIssues(e)}` });
      else dispatch({ type: "LOAD_ERROR", error: e instanceof Error ? e.message : "Failed to load lesson" });
    }
  };

  const celebrate = useCallback(() => { dispatch({ type: "CELEBRATE" }); setTimeout(() => dispatch({ type: "CELEBRATE_END" }), 1000); }, []);
  const handleAnswer = useCallback((slideId: string, correct: boolean, answer: string) => {
    dispatch({ type: "ANSWER_SUBMITTED", slideId, correct, answer });
    if (correct) celebrate();
  }, [celebrate]);
  const restart = useCallback(() => { dispatch({ type: "RESTART" }); setFile(null); setText(""); }, []);

  /* ═══════ RENDER: Upload ═══════ */
  if (phase === "upload" || phase === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 380, padding: 24 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.accentGrad, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}><Database size={26} color="white" /></div>
            <h1 style={{ fontSize: 26, fontWeight: 600, color: "white", marginBottom: 8 }}>Data Foundations</h1>
            <p style={{ color: T.textMuted, fontSize: 15 }}>Interactive lesson · 3 min</p>
          </div>

          {cacheStale && (
            <div role="alert" style={{ padding: 16, background: `${T.orange}10`, border: `1px solid ${T.orange}40`, borderRadius: 12, marginBottom: 20, fontSize: 14, color: "#fdba74" }}>
              <RefreshCw size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
              Your cached lesson was outdated and has been cleared. Generate a fresh one below.
            </div>
          )}
          {error && (
            <div role="alert" style={{ padding: 16, background: `${T.error}10`, border: `1px solid ${T.error}40`, borderRadius: 12, marginBottom: 20, fontSize: 14, color: "#fca5a5" }}>
              <AlertTriangle size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />{error}
            </div>
          )}

          {phase === "loading" ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid transparent", borderTopColor: T.accent }} />
            </div>
          ) : (
            <>
              <div role="button" tabIndex={0} aria-label={file ? `Selected: ${file.name}` : "Upload resume PDF"} onClick={() => fileRef.current?.click()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
                style={{ padding: 28, borderRadius: 12, border: `1px dashed ${file ? T.success : T.border}`, cursor: "pointer", marginBottom: 16, background: file ? `${T.success}05` : "transparent" }}>
                <input ref={fileRef} type="file" accept=".pdf" aria-hidden="true" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} style={{ display: "none" }} />
                <div style={{ width: 40, height: 40, borderRadius: 10, margin: "0 auto 12px", background: file ? T.success : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {file ? <Check size={20} color="white" /> : <Database size={20} color={T.textMuted} />}
                </div>
                <div style={{ color: file ? T.success : "white", fontWeight: 500, fontSize: 14, textAlign: "center" }}>{file ? file.name : "Upload Resume (PDF)"}</div>
              </div>
              <div style={{ color: T.textDim, fontSize: 13, textAlign: "center", marginBottom: 16 }}>or</div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste resume text..." aria-label="Resume text"
                style={{ width: "100%", minHeight: 80, padding: 14, borderRadius: 10, border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.02)", color: "white", fontSize: 14, resize: "none", outline: "none", marginBottom: 20, fontFamily: T.font, boxSizing: "border-box" }} />
              <button onClick={start} disabled={!file && text.length < 50} aria-label="Start lesson"
                style={{ width: "100%", padding: "14px 20px", borderRadius: 10, border: "none", background: file || text.length >= 50 ? T.accentGrad : "rgba(255,255,255,0.1)", color: "white", fontSize: 15, fontWeight: 500, cursor: file || text.length >= 50 ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Sparkles size={18} /> Start Lesson
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ═══════ RENDER: Complete ═══════ */
  if (phase === "complete" && lesson) {
    const sumSlide = lesson.slides.find((s) => s.type === "summary") ?? {
      id: "done", type: "summary" as const, title: "Lesson Complete!", body: "Great work — you've built a data analytics foundation.",
      checklist: [{ icon: "Eye", text: "Check the grain first" }, { icon: "Hash", text: "COUNT(*) = all rows" }, { icon: "Users", text: "COUNT(DISTINCT) = unique values" }],
    };
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 500 }}>
          <SlideSummary slide={sumSlide} stats={{ streak, maxStreak, elapsedSec, results: slideResults }} />
          <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
            <button onClick={restart} aria-label="Restart lesson" style={{ padding: "12px 24px", borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", color: T.textSecondary, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <RotateCcw size={16} /> Restart Lesson
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════ RENDER: Active lesson ═══════ */
  if (!lesson) return null;
  const cur = lesson.slides[slideIdx];
  if (!cur) return null;
  const isLast = slideIdx === lesson.slides.length - 1;
  const isFirst = slideIdx === 0;
  const curResult = slideResults[cur.id];
  const remSlide = remediationSlideId ? lesson.slides.find((s) => s.id === remediationSlideId) : null;

  const renderCurrent = () => {
    switch (cur.type) {
      case "intro": return <SlideIntro slide={cur} />;
      case "concept": return <SlideConcept slide={cur} onComplete={celebrate} />;
      case "quiz": return <SlideQuiz slide={cur} onComplete={celebrate} pastResult={curResult} onAnswer={(c, a) => handleAnswer(cur.id, c, a)} />;
      case "checkpoint": return <SlideCheckpoint slide={cur} onComplete={celebrate} />;
      case "summary": return <SlideSummary slide={cur} stats={{ streak, maxStreak, elapsedSec, results: slideResults }} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      {flash && <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }} transition={{ duration: 1 }} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, background: `radial-gradient(circle at 50% 50%, ${T.success}25 0%, transparent 50%)` }} />}

      <AnimatePresence>{phase === "remediation" && remSlide && <RemediationOverlay slide={remSlide} onDismiss={() => dispatch({ type: "REMEDIATION_DONE" })} />}</AnimatePresence>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(9,9,11,0.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "12px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: T.textMuted, fontSize: 13, fontWeight: 500 }}>{lesson.title}</span>
              <StreakBadge streak={streak} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: T.textDim, fontSize: 12, fontFamily: "monospace", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {fmtTime(elapsedSec)}</span>
              <span style={{ color: T.textMuted, fontSize: 13 }}>{slideIdx + 1}/{lesson.slides.length}</span>
              <button onClick={restart} title="Restart" aria-label="Restart lesson" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: T.textMuted, display: "flex", alignItems: "center" }}><RotateCcw size={14} /></button>
            </div>
          </div>
          <div role="progressbar" aria-valuenow={slideIdx + 1} aria-valuemin={1} aria-valuemax={lesson.slides.length} aria-label={`Slide ${slideIdx + 1} of ${lesson.slides.length}`}
            style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
            <motion.div animate={{ width: `${((slideIdx + 1) / lesson.slides.length) * 100}%` }} style={{ height: "100%", background: T.accentGrad, borderRadius: 2 }} />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px 140px", minHeight: "calc(100vh - 180px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div key={cur.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {renderCurrent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(9,9,11,0.9)", backdropFilter: "blur(12px)", borderTop: `1px solid ${T.border}`, padding: "16px 24px" }}>
        <div style={{ display: "flex", gap: 12, maxWidth: 400, margin: "0 auto" }}>
          <button onClick={prev} disabled={isFirst} aria-label="Previous slide"
            style={{ width: 48, height: 48, borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", color: isFirst ? "#27272a" : T.textSecondary, cursor: isFirst ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={isLast ? () => dispatch({ type: "NEXT_SLIDE" }) : next} aria-label={isLast ? "Complete lesson" : "Next slide"}
            style={{ flex: 1, height: 48, borderRadius: 10, border: "none", background: T.accentGrad, color: "white", fontSize: 15, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {isLast ? <><span>Finish</span> <Trophy size={16} /></> : <><span>Continue</span> <ChevronRight size={18} /></>}
          </button>
        </div>
      </footer>
    </div>
  );
}