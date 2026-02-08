"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  DollarSign,
  Users,
  Hash,
  Coffee,
  ShoppingBag,
  TrendingUp,
  Lightbulb,
  Award,
  Zap,
  ArrowDown,
  Eye,
  Terminal,
  ArrowRight,
} from "lucide-react";

/* ═══════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════ */

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
  font: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

/* ═══════════════════════════════════════════
   ZOD SCHEMAS
   ═══════════════════════════════════════════ */

const IconRefSchema = z.string().optional();

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

const MatchingPairSchema = z.object({
  left: z.string(),
  right: z.string(),
});

const MatchingVisualSchema = z.object({
  type: z.literal("matching"),
  pairs: z.array(MatchingPairSchema),
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
  icon: IconRefSchema,
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
  badgeIcon: IconRefSchema,
  visual: VisualSchema.optional(),
  options: z.array(QuizOptionSchema).optional(),
  checklist: z.array(ChecklistItemSchema).optional(),
  phases: z.array(z.object({
    content: z.string(),
    delay: z.number().optional(),
  })).optional(),
  autoAdvance: z.boolean().optional(),
  successMessage: z.string().optional(),
  failureMessage: z.string().optional(),
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
type QuizOption = z.infer<typeof QuizOptionSchema>;

/* ═══════════════════════════════════════════
   ANALYTICS
   ═══════════════════════════════════════════ */

const STORAGE_KEY = "apex_lesson1";
const SESSION_KEY = "apex_session";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

async function trackEvent(
  event: "lesson_started" | "slide_viewed" | "answer_submitted" | "lesson_completed",
  payload: Record<string, unknown> = {}
) {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        sessionId: getSessionId(),
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    });
  } catch {
    // analytics are fire-and-forget
  }
}

/* ═══════════════════════════════════════════
   ICON MAP  (string → component)
   ═══════════════════════════════════════════ */

const ICON_MAP: Record<string, React.ElementType> = {
  Eye, Hash, Users, Coffee, Database, Sparkles, Award, Zap, Lightbulb,
  AlertTriangle, DollarSign, ShoppingBag, TrendingUp, Terminal, Check,
  Play, ArrowDown, ArrowRight,
};

function resolveIcon(name?: string, fallback: React.ElementType = Sparkles): React.ElementType {
  if (!name) return fallback;
  return ICON_MAP[name] ?? fallback;
}

/* ═══════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════ */

function Badge({ text, color = T.accent, icon }: { text: string; color?: string; icon?: string }) {
  const Icon = resolveIcon(icon);
  return (
    <div style={{
      display: "inline-flex", padding: "8px 16px", background: `${color}15`,
      border: `1px solid ${color}30`, borderRadius: 8, alignItems: "center", gap: 8, marginBottom: 24,
    }}>
      <Icon size={18} color={color} />
      <span style={{ color, fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" }}>{text}</span>
    </div>
  );
}

function Avatar({ name, color, size = 48, active, excluded, count }: {
  name: string; color: string; size?: number; active?: boolean; excluded?: boolean; count?: number;
}) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  return (
    <motion.div
      animate={{ scale: active ? 1.1 : 1, opacity: excluded ? 0.3 : 1, y: active ? -8 : 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}
    >
      <div style={{
        width: size, height: size, borderRadius: size / 3,
        background: excluded ? `${T.error}30` : active ? `${color}30` : "rgba(255,255,255,0.05)",
        border: `3px solid ${excluded ? T.error : active ? color : "rgba(255,255,255,0.1)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.35, fontWeight: 700, color: excluded ? T.error : active ? color : T.textMuted,
      }}>
        {initials}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: excluded ? T.error : active ? color : T.textMuted }}>
        {name}
      </span>
      {excluded && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{
          position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%",
          background: T.error, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <X size={12} color="white" strokeWidth={3} />
        </motion.div>
      )}
      {count !== undefined && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{
          position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%",
          background: T.success, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "white",
        }}>
          {count}
        </motion.div>
      )}
    </motion.div>
  );
}

function PrimaryBtn({ children, onClick, disabled, full }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; full?: boolean;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: full ? "100%" : "auto", padding: "14px 32px", background: disabled ? "rgba(255,255,255,0.1)" : T.accentGrad,
        border: "none", borderRadius: 12, color: "white", fontSize: 16, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 10,
      }}
    >
      {children}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════
   VISUAL: LIVE TABLE
   ═══════════════════════════════════════════ */

function VisualLiveTable({ visual, onComplete }: { visual: z.infer<typeof LiveTableVisualSchema>; onComplete?: () => void }) {
  const { orders, revealSpeed = 600 } = visual;
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const start = () => {
    setRunning(true);
    setStep(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStep(i);
      if (i >= orders.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, revealSpeed);
  };

  const visible = orders.slice(0, step);
  const unique = [...new Set(visible.map((o) => o.customer))];

  return (
    <div>
      {/* Customer row */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 24, padding: "24px 16px",
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 16,
      }}>
        {unique.length === 0 ? (
          <div style={{ color: T.textDim, fontSize: 14, padding: 20 }}>Customers will appear here…</div>
        ) : (
          unique.map((name) => {
            const o = orders.find((x) => x.customer === name)!;
            const ct = visible.filter((x) => x.customer === name).length;
            return (
              <motion.div key={name} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }}>
                <Avatar name={name} color={o.color ?? T.accent} size={56} active count={ct} />
              </motion.div>
            );
          })
        )}
      </div>

      {/* Table */}
      <div style={{
        background: "#0c0c0f", border: `1px solid ${T.border}`, borderRadius: 12,
        overflow: "hidden", marginBottom: 24, minHeight: 180,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1.2fr 80px", borderBottom: `1px solid ${T.border}` }}>
          {["#", "Customer", "Item", "Price"].map((h) => (
            <div key={h} style={{
              padding: "10px 12px", fontSize: 11, fontWeight: 600, color: T.textMuted,
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>{h}</div>
          ))}
        </div>
        <div style={{ padding: 8 }}>
          {visible.map((o) => (
            <motion.div key={o.id}
              initial={{ opacity: 0, x: -20, backgroundColor: `${o.color ?? T.accent}20` }}
              animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
              style={{ display: "grid", gridTemplateColumns: "60px 1fr 1.2fr 80px", padding: "10px 12px", borderRadius: 8 }}
            >
              <div style={{ fontFamily: "monospace", fontSize: 13, color: T.textMuted }}>{o.id}</div>
              <div style={{ fontSize: 14, color: o.color ?? T.accent, fontWeight: 600 }}>{o.customer}</div>
              <div style={{ fontSize: 14, color: T.textSecondary }}>{o.item}</div>
              <div style={{ fontSize: 14, color: T.textSecondary, fontFamily: "monospace" }}>{o.price}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
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

      {!running && (
        <PrimaryBtn onClick={start} full>
          <Play size={20} fill="white" /> Watch Orders
        </PrimaryBtn>
      )}

      {step >= orders.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
          padding: "16px 20px", background: `${T.yellow}10`, border: `1px solid ${T.yellow}30`,
          borderRadius: 12, display: "flex", alignItems: "center", gap: 12,
        }}>
          <Lightbulb size={22} color={T.yellow} />
          <span style={{ color: "#fef08a", fontSize: 15 }}>
            Notice: <strong>{orders.length} orders</strong>, but only <strong>{unique.length} different people</strong>
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VISUAL: COUNT DEMO
   ═══════════════════════════════════════════ */

function VisualCountDemo({ visual, onComplete }: { visual: z.infer<typeof CountDemoVisualSchema>; onComplete?: () => void }) {
  const { people } = visual;
  const [mode, setMode] = useState<"idle" | "running" | "done">("idle");
  const [step, setStep] = useState(0);
  const [excluded, setExcluded] = useState<number[]>([]);
  const [result, setResult] = useState(0);

  const run = () => {
    setMode("running");
    setStep(0);
    setExcluded([]);
    setResult(0);
    const seen = new Set<string>();
    let i = 0;
    const interval = setInterval(() => {
      if (i < people.length) {
        setStep(i + 1);
        if (seen.has(people[i].name)) {
          setExcluded((p) => [...p, i]);
        } else {
          seen.add(people[i].name);
          setResult(seen.size);
        }
        i++;
      } else {
        clearInterval(interval);
        setMode("done");
        onComplete?.();
      }
    }, 700);
  };

  return (
    <div>
      <div style={{
        display: "flex", justifyContent: "center", gap: 16, padding: "32px 20px",
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 24, flexWrap: "wrap",
      }}>
        {people.map((p, i) => (
          <Avatar key={i} name={p.name} color={p.color} size={52}
            active={i < step && !excluded.includes(i)} excluded={excluded.includes(i)} />
        ))}
      </div>

      {mode !== "idle" && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{
            padding: "24px 56px", background: `${T.success}15`, border: `2px solid ${T.success}`,
            borderRadius: 20, textAlign: "center",
          }}>
            <motion.div key={result} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
              style={{ fontSize: 64, fontWeight: 800, color: T.success }}>{result}</motion.div>
            <div style={{ color: "#6ee7b7", fontSize: 14 }}>unique customers</div>
          </div>
        </motion.div>
      )}

      {mode !== "idle" && step >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24, fontSize: 13, color: T.textSecondary }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 4, background: T.success }} /> Counted
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 4, background: T.error }} /> Skipped (duplicate)
          </div>
        </motion.div>
      )}

      {mode === "idle" && (
        <PrimaryBtn onClick={run} full>
          <Play size={20} fill="white" /> Run COUNT(DISTINCT customer)
        </PrimaryBtn>
      )}

      {mode === "done" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
          padding: "16px 20px", background: `${T.success}10`, border: `1px solid ${T.success}30`,
          borderRadius: 12, textAlign: "center", color: "#6ee7b7", fontSize: 15,
        }}>
          Duplicates were each counted only <strong>once</strong>.
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VISUAL: MATCHING
   ═══════════════════════════════════════════ */

function VisualMatching({ visual, onComplete }: { visual: z.infer<typeof MatchingVisualSchema>; onComplete?: () => void }) {
  const { pairs, shuffleRight = true } = visual;
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({});
  const [wrong, setWrong] = useState<number | null>(null);

  const rightOrder = useMemo(() => {
    if (!shuffleRight) return pairs.map((_, i) => i);
    const arr = pairs.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [pairs, shuffleRight]);

  const matchedRights = new Set(Object.values(matched));
  const done = Object.keys(matched).length === pairs.length;

  useEffect(() => { if (done) onComplete?.(); }, [done]);

  const handleRight = (ri: number) => {
    if (selectedLeft === null || matchedRights.has(ri)) return;
    if (ri === selectedLeft) {
      setMatched((m) => ({ ...m, [selectedLeft]: ri }));
      setSelectedLeft(null);
    } else {
      setWrong(ri);
      setTimeout(() => setWrong(null), 600);
      setSelectedLeft(null);
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pairs.map((p, i) => {
            const isMatched = i in matched;
            const isSel = selectedLeft === i;
            return (
              <motion.button key={`l-${i}`}
                whileHover={!isMatched ? { scale: 1.02 } : {}}
                onClick={() => !isMatched && setSelectedLeft(i)}
                style={{
                  padding: "14px 16px", borderRadius: 12, textAlign: "left",
                  background: isMatched ? `${T.success}15` : isSel ? `${T.accent}20` : T.surface,
                  border: `2px solid ${isMatched ? T.success : isSel ? T.accent : T.border}`,
                  cursor: isMatched ? "default" : "pointer", color: "white", fontSize: 14, fontWeight: 500,
                }}
              >
                {isMatched && <Check size={14} color={T.success} style={{ marginRight: 8 }} />}
                {p.left}
              </motion.button>
            );
          })}
        </div>
        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rightOrder.map((ri) => {
            const isMatched = matchedRights.has(ri);
            const isWrong = wrong === ri;
            return (
              <motion.button key={`r-${ri}`}
                animate={isWrong ? { x: [0, -6, 6, -6, 0] } : {}}
                whileHover={!isMatched ? { scale: 1.02 } : {}}
                onClick={() => handleRight(ri)}
                style={{
                  padding: "14px 16px", borderRadius: 12, textAlign: "left",
                  background: isMatched ? `${T.success}15` : isWrong ? `${T.error}20` : T.surface,
                  border: `2px solid ${isMatched ? T.success : isWrong ? T.error : T.border}`,
                  cursor: isMatched ? "default" : "pointer", color: "white", fontSize: 14, fontWeight: 500,
                }}
              >
                {pairs[ri].right}
              </motion.button>
            );
          })}
        </div>
      </div>
      {done && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
          marginTop: 20, padding: "16px 20px", background: `${T.success}10`, border: `1px solid ${T.success}30`,
          borderRadius: 12, textAlign: "center", color: "#6ee7b7", fontSize: 15,
        }}>
          <Check size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
          All matched correctly!
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VISUAL: SQL PLAYGROUND
   ═══════════════════════════════════════════ */

// Tagged result type so TypeScript can narrow through ok/error branches
type SqlOk = { ok: true; columns: string[]; rows: (string | number)[][] };
type SqlErr = { ok: false; error: string };
type SqlResult = SqlOk | SqlErr;

// Strict SQL executor — only allows COUNT(*) and COUNT(DISTINCT customer) on the provided orders data
function executeSafeSQL(raw: string, orders: OrderRow[]): SqlResult {
  const sql = raw.trim().replace(/;$/, "").replace(/\s+/g, " ").toLowerCase();

  // Whitelist patterns — field is "customer" to match the dataset
  const countAll = /^select\s+count\(\s*\*\s*\)\s+from\s+orders$/;
  const countDistinct = /^select\s+count\(\s*distinct\s+customer\s*\)\s+from\s+orders$/;

  if (countAll.test(sql)) {
    return { ok: true, columns: ["count"], rows: [[orders.length]] };
  }

  if (countDistinct.test(sql)) {
    const unique = new Set(orders.map((o) => o.customer));
    return { ok: true, columns: ["count"], rows: [[unique.size]] };
  }

  return {
    ok: false,
    error:
      "Only these queries are allowed on this playground:\n• SELECT COUNT(*) FROM orders\n• SELECT COUNT(DISTINCT customer) FROM orders",
  };
}

function VisualSqlPlayground({ visual, onComplete }: { visual: z.infer<typeof SqlPlaygroundVisualSchema>; onComplete?: () => void }) {
  const { orders, defaultQuery = "", hint } = visual;
  const [query, setQuery] = useState(defaultQuery);
  const [result, setResult] = useState<SqlResult | null>(null);
  const [hasRunDistinct, setHasRunDistinct] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const run = () => {
    const res = executeSafeSQL(query, orders);
    setResult(res);

    trackEvent("answer_submitted", { visual: "sql_playground", query: query.trim() });

    if (res.ok) {
      const isDistinct = /distinct/i.test(query);
      if (isDistinct && !hasRunDistinct) {
        setHasRunDistinct(true);
        onComplete?.();
      }
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  };

  return (
    <div>
      {/* Mini data preview */}
      <div style={{
        marginBottom: 16, padding: 16, background: "#0c0c0f", border: `1px solid ${T.border}`,
        borderRadius: 12, overflow: "auto", maxHeight: 180,
      }}>
        <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
          <Database size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />
          orders table ({orders.length} rows)
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["id", "customer", "item", "price"].map((h) => (
                <th key={h} style={{
                  textAlign: "left", padding: "4px 8px", color: T.textMuted, fontWeight: 600,
                  borderBottom: `1px solid ${T.border}`, fontSize: 11, textTransform: "uppercase",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ padding: "4px 8px", color: T.textMuted, fontFamily: "monospace" }}>{o.id}</td>
                <td style={{ padding: "4px 8px", color: o.color ?? T.accent, fontWeight: 600 }}>{o.customer}</td>
                <td style={{ padding: "4px 8px", color: T.textSecondary }}>{o.item}</td>
                <td style={{ padding: "4px 8px", color: T.textSecondary, fontFamily: "monospace" }}>{o.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor */}
      <div style={{
        borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 16,
        background: "#0c0c0f",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 12px", borderBottom: `1px solid ${T.border}`, background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMuted }}>
            <Terminal size={14} /> SQL Editor
          </div>
          <span style={{ fontSize: 11, color: T.textDim }}>⌘+Enter to run</span>
        </div>
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          spellCheck={false}
          rows={3}
          style={{
            width: "100%", padding: "14px 16px", background: "transparent", border: "none",
            color: T.accent, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 14,
            resize: "none", outline: "none", lineHeight: 1.6,
          }}
        />
      </div>

      {hint && !result && (
        <div style={{ marginBottom: 16, fontSize: 13, color: T.textDim, fontStyle: "italic" }}>
          💡 {hint}
        </div>
      )}

      <PrimaryBtn onClick={run} full>
        <Play size={18} /> Run Query
      </PrimaryBtn>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20 }}>
          {!result.ok ? (
            <div style={{
              padding: 20, background: `${T.error}10`, border: `1px solid ${T.error}40`, borderRadius: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <AlertTriangle size={18} color={T.error} />
                <span style={{ color: T.error, fontWeight: 700 }}>Query Not Allowed</span>
              </div>
              <pre style={{
                color: "#fca5a5", fontSize: 13, margin: 0, whiteSpace: "pre-wrap",
                fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6,
              }}>{result.error}</pre>
            </div>
          ) : (
            <div style={{
              borderRadius: 12, overflow: "hidden", border: `1px solid ${T.success}40`,
            }}>
              <div style={{
                padding: "8px 14px", background: `${T.success}15`,
                fontSize: 12, fontWeight: 600, color: T.success,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Check size={14} /> Result
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {result.columns.map((c) => (
                      <th key={c} style={{
                        textAlign: "left", padding: "10px 16px", background: "rgba(255,255,255,0.03)",
                        color: T.textMuted, fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.05em", borderBottom: `1px solid ${T.border}`,
                      }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: "12px 16px", color: "white", fontSize: 24, fontWeight: 700,
                          fontFamily: "monospace",
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VISUAL DISPATCHER
   ═══════════════════════════════════════════ */

function VisualRenderer({ visual, onComplete }: { visual: Visual; onComplete?: () => void }) {
  switch (visual.type) {
    case "live_table":
      return <VisualLiveTable visual={visual} onComplete={onComplete} />;
    case "count_demo":
      return <VisualCountDemo visual={visual} onComplete={onComplete} />;
    case "matching":
      return <VisualMatching visual={visual} onComplete={onComplete} />;
    case "sql_playground":
      return <VisualSqlPlayground visual={visual} onComplete={onComplete} />;
    default:
      return null;
  }
}

/* ═══════════════════════════════════════════
   SLIDE TYPE: INTRO  (phases, dramatic reveal)
   ═══════════════════════════════════════════ */

function SlideIntro({ slide }: { slide: Slide }) {
  const phases = slide.phases ?? [];
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (phases.length === 0) { setPhase(1); return; }
    const timers = phases.map((p, i) => setTimeout(() => setPhase(i + 1), p.delay ?? (i + 1) * 1200));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ maxWidth: 500, textAlign: "center" }}>
      {slide.badge && <Badge text={slide.badge} color={slide.badgeColor} icon={slide.badgeIcon} />}

      <AnimatePresence mode="wait">
        {phases.length > 0 && phase === 0 && (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: 60 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 40, height: 40, borderRadius: "50%", border: "3px solid transparent",
                borderTopColor: T.accent, margin: "0 auto",
              }} />
          </motion.div>
        )}

        {phases.map(
          (p, i) =>
            phase === i + 1 &&
            i < phases.length - 1 && (
              <motion.div key={`phase-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} style={{ minHeight: 120 }}>
                <div dangerouslySetInnerHTML={{ __html: p.content }}
                  style={{ color: "white", fontSize: 20, lineHeight: 1.6 }} />
              </motion.div>
            )
        )}

        {(phases.length === 0 || phase >= phases.length) && (
          <motion.div key="final" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {phases.length > 0 && (
              <div dangerouslySetInnerHTML={{ __html: phases[phases.length - 1].content }}
                style={{ color: T.textSecondary, fontSize: 17, lineHeight: 1.7, marginBottom: 24 }} />
            )}
            {slide.title && (
              <h2 style={{ fontSize: 32, fontWeight: 700, color: "white", marginBottom: 20, lineHeight: 1.3 }}>
                {slide.title}
              </h2>
            )}
            {slide.body && (
              <p style={{ color: T.textMuted, fontSize: 17, lineHeight: 1.7 }}>
                {slide.body}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDE TYPE: CONCEPT
   ═══════════════════════════════════════════ */

function SlideConcept({ slide, onComplete }: { slide: Slide; onComplete?: () => void }) {
  const [expanded, setExpanded] = useState(!slide.visual);

  return (
    <div style={{ maxWidth: 520 }}>
      {slide.badge && <Badge text={slide.badge} color={slide.badgeColor} icon={slide.badgeIcon} />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {slide.title && (
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "white", marginBottom: 16, lineHeight: 1.3 }}>
            <span dangerouslySetInnerHTML={{ __html: slide.title }} />
          </h2>
        )}
        {slide.body && (
          <p style={{ color: T.textSecondary, fontSize: 17, lineHeight: 1.8, marginBottom: 28 }}
            dangerouslySetInnerHTML={{ __html: slide.body }} />
        )}
      </motion.div>

      {slide.visual && !expanded && (
        <PrimaryBtn onClick={() => setExpanded(true)}>
          {slide.subtitle ?? "Show me"} <ChevronRight size={18} />
        </PrimaryBtn>
      )}

      {slide.visual && expanded && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <VisualRenderer visual={slide.visual} onComplete={onComplete} />
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDE TYPE: QUIZ
   ═══════════════════════════════════════════ */

function SlideQuiz({ slide, onComplete }: { slide: Slide; onComplete?: () => void }) {
  const options = slide.options ?? [];
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setTimeout(() => setRevealed(true), 500);

    const opt = options[i];
    trackEvent("answer_submitted", { slideId: slide.id, answer: opt.value, correct: !!opt.correct });

    if (opt.correct) setTimeout(() => onComplete?.(), 1200);
  };

  return (
    <div style={{ maxWidth: 500 }}>
      {slide.badge && <Badge text={slide.badge} color={slide.badgeColor} icon={slide.badgeIcon} />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {slide.title && (
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "white", marginBottom: 12 }}>{slide.title}</h2>
        )}
        {slide.subtitle && (
          <p style={{ color: "white", fontSize: 18, fontStyle: "italic", marginBottom: 8 }}>{slide.subtitle}</p>
        )}
        {slide.body && (
          <p style={{ color: T.textMuted, fontSize: 15, marginBottom: 28 }}>{slide.body}</p>
        )}
      </motion.div>

      <div style={{ display: "flex", flexDirection: options.length <= 2 ? "row" : "column", gap: 12, marginBottom: 24 }}>
        {options.map((opt, i) => {
          const isCorrect = opt.correct;
          const isSelected = i === selected;
          const showResult = revealed;
          const twoCol = options.length <= 2;

          return (
            <motion.button key={i}
              whileHover={!showResult ? { borderColor: "rgba(255,255,255,0.2)" } : {}}
              onClick={() => handleSelect(i)}
              style={{
                flex: twoCol ? 1 : undefined, padding: twoCol ? "28px 20px" : "20px",
                borderRadius: 14, textAlign: twoCol ? "center" : "left",
                background: showResult && isCorrect ? `${T.success}15` : showResult && isSelected ? `${T.error}15` : T.surface,
                border: `2px solid ${showResult && isCorrect ? T.success : showResult && isSelected ? T.error : T.border}`,
                cursor: showResult ? "default" : "pointer",
              }}
            >
              {twoCol ? (
                <>
                  <div style={{
                    fontSize: 48, fontWeight: 800, marginBottom: 8,
                    color: showResult && isCorrect ? T.success : showResult && isSelected ? T.error
                      : isSelected ? T.accent : "white",
                  }}>{opt.value}</div>
                  <div style={{ color: T.textSecondary, fontSize: 14 }}>{opt.label}</div>
                </>
              ) : (
                <code style={{
                  fontSize: 15,
                  color: showResult && isCorrect ? T.success : showResult && isSelected ? T.error : "white",
                }}>{opt.label}</code>
              )}

              {showResult && isCorrect && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: T.success, fontSize: 14 }}>
                  <Check size={18} /> {slide.successMessage ?? "Correct!"}
                </motion.div>
              )}
              {showResult && isSelected && !isCorrect && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: T.error, fontSize: 14 }}>
                  <X size={18} /> {slide.failureMessage ?? "Not quite"}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Optional visual below quiz */}
      {slide.visual && revealed && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <VisualRenderer visual={slide.visual} onComplete={onComplete} />
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDE TYPE: CHECKPOINT (interactive visual w/ context)
   ═══════════════════════════════════════════ */

function SlideCheckpoint({ slide, onComplete }: { slide: Slide; onComplete?: () => void }) {
  return (
    <div style={{ maxWidth: 540 }}>
      {slide.badge && <Badge text={slide.badge} color={slide.badgeColor} icon={slide.badgeIcon} />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {slide.title && (
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>{slide.title}</h2>
        )}
        {slide.body && (
          <p style={{ color: T.textMuted, fontSize: 15, marginBottom: 24 }}
            dangerouslySetInnerHTML={{ __html: slide.body }} />
        )}
      </motion.div>

      {slide.visual && <VisualRenderer visual={slide.visual} onComplete={onComplete} />}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDE TYPE: SUMMARY
   ═══════════════════════════════════════════ */

function SlideSummary({ slide }: { slide: Slide }) {
  const items = slide.checklist ?? [];

  return (
    <div style={{ textAlign: "center", maxWidth: 460 }}>
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10 }}
        style={{
          width: 88, height: 88, borderRadius: 28,
          background: `linear-gradient(135deg, ${T.success} 0%, #059669 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px", boxShadow: `0 20px 50px ${T.success}50`,
        }}>
        <Award size={44} color="white" />
      </motion.div>

      {slide.title && (
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 36, fontWeight: 800, color: "white", marginBottom: 12 }}>
          {slide.title}
        </motion.h2>
      )}

      {slide.body && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ color: T.textSecondary, fontSize: 17, marginBottom: 40, lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: slide.body }} />
      )}

      {items.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{
            padding: 28, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, textAlign: "left",
          }}>
          <div style={{
            color: T.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20,
          }}>
            Your new mental checklist
          </div>
          {items.map((item, i) => {
            const Icon = resolveIcon(item.icon, Check);
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
                  borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none",
                }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: `${T.accent}20`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={18} color={T.accent} />
                </div>
                <span style={{ color: "white", fontSize: 16, fontWeight: 500 }}>{item.text}</span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDE DISPATCHER  (no switch on names)
   ═══════════════════════════════════════════ */

const SLIDE_COMPONENTS: Record<Slide["type"], React.FC<{ slide: Slide; onComplete?: () => void }>> = {
  intro: ({ slide }) => <SlideIntro slide={slide} />,
  concept: ({ slide, onComplete }) => <SlideConcept slide={slide} onComplete={onComplete} />,
  quiz: ({ slide, onComplete }) => <SlideQuiz slide={slide} onComplete={onComplete} />,
  checkpoint: ({ slide, onComplete }) => <SlideCheckpoint slide={slide} onComplete={onComplete} />,
  summary: ({ slide }) => <SlideSummary slide={slide} />,
};

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function Lesson1Page() {
  // Pre-lesson state
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Lesson state
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [flash, setFlash] = useState(false);

  // Try to restore from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = LessonSchema.parse(JSON.parse(cached));
        setLesson(parsed);
        setStarted(true);
        trackEvent("lesson_started", { lessonId: parsed.id, source: "cache" });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Track slide views
  useEffect(() => {
    if (!lesson) return;
    const s = lesson.slides[slideIdx];
    if (s) trackEvent("slide_viewed", { lessonId: lesson.id, slideId: s.id, slideIndex: slideIdx });
  }, [slideIdx, lesson]);

  // Track completion
  useEffect(() => {
    if (lesson && slideIdx === lesson.slides.length - 1) {
      trackEvent("lesson_completed", { lessonId: lesson.id });
    }
  }, [slideIdx, lesson]);

  const start = async () => {
    if (!file && text.length < 50) return;
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      if (file) form.append("resumeFile", file);
      else form.append("resumeText", text);

      const res = await fetch("/api/lesson1", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const json = await res.json();
      const validated = LessonSchema.parse(json);

      // Persist
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      setLesson(validated);
      setStarted(true);
      setSlideIdx(0);
      trackEvent("lesson_started", { lessonId: validated.id, source: "fresh" });
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        setError(`Invalid lesson data: ${e.issues.map((x) => x.message).join(", ")}`);
      } else {
        setError(e instanceof Error ? e.message : "Failed to load lesson");
      }
    } finally {
      setLoading(false);
    }
  };

  const celebrate = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 1000);
  }, []);

  const next = useCallback(() => {
    if (lesson && slideIdx < lesson.slides.length - 1) setSlideIdx((s) => s + 1);
  }, [slideIdx, lesson]);

  const prev = useCallback(() => {
    if (slideIdx > 0) setSlideIdx((s) => s - 1);
  }, [slideIdx]);

  const restart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLesson(null);
    setStarted(false);
    setSlideIdx(0);
    setFile(null);
    setText("");
  }, []);

  // Keyboard nav
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  /* ─── PRE-LESSON SCREEN ─── */
  if (!started || !lesson) {
    return (
      <div style={{
        minHeight: "100vh", background: T.bg, fontFamily: T.font,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ maxWidth: 380, padding: 24 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: T.accentGrad,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
            }}>
              <Database size={26} color="white" />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 600, color: "white", marginBottom: 8 }}>Data Foundations</h1>
            <p style={{ color: T.textMuted, fontSize: 15 }}>Interactive lesson • 3 min</p>
          </div>

          {error && (
            <div style={{
              padding: 16, background: `${T.error}10`, border: `1px solid ${T.error}40`,
              borderRadius: 12, marginBottom: 20, fontSize: 14, color: "#fca5a5",
            }}>
              <AlertTriangle size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid transparent", borderTopColor: T.accent }} />
            </div>
          ) : (
            <>
              <div onClick={() => fileRef.current?.click()}
                style={{
                  padding: 28, borderRadius: 12, border: `1px dashed ${file ? T.success : T.border}`,
                  cursor: "pointer", marginBottom: 16, background: file ? `${T.success}05` : "transparent",
                }}>
                <input ref={fileRef} type="file" accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                  style={{ display: "none" }} />
                <div style={{
                  width: 40, height: 40, borderRadius: 10, margin: "0 auto 12px",
                  background: file ? T.success : "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {file ? <Check size={20} color="white" /> : <Database size={20} color={T.textMuted} />}
                </div>
                <div style={{ color: file ? T.success : "white", fontWeight: 500, fontSize: 14, textAlign: "center" }}>
                  {file ? file.name : "Upload Resume (PDF)"}
                </div>
              </div>

              <div style={{ color: T.textDim, fontSize: 13, textAlign: "center", marginBottom: 16 }}>or</div>

              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste resume text..."
                style={{
                  width: "100%", minHeight: 80, padding: 14, borderRadius: 10, border: `1px solid ${T.border}`,
                  background: "rgba(255,255,255,0.02)", color: "white", fontSize: 14, resize: "none",
                  outline: "none", marginBottom: 20, fontFamily: T.font,
                }} />

              <button onClick={start} disabled={!file && text.length < 50}
                style={{
                  width: "100%", padding: "14px 20px", borderRadius: 10, border: "none",
                  background: file || text.length >= 50 ? T.accentGrad : "rgba(255,255,255,0.1)",
                  color: "white", fontSize: 15, fontWeight: 500,
                  cursor: file || text.length >= 50 ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                <Sparkles size={18} /> Start Lesson
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ─── LESSON RUNNER ─── */
  const currentSlide = lesson.slides[slideIdx];
  const SlideComponent = SLIDE_COMPONENTS[currentSlide.type];
  const isLast = slideIdx === lesson.slides.length - 1;
  const isFirst = slideIdx === 0;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      {/* Celebration flash */}
      {flash && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }} transition={{ duration: 1 }}
          style={{
            position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100,
            background: `radial-gradient(circle at 50% 50%, ${T.success}25 0%, transparent 50%)`,
          }} />
      )}

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, background: "rgba(9,9,11,0.85)",
        backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ color: T.textMuted, fontSize: 13, fontWeight: 500 }}>{lesson.title}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: T.textMuted, fontSize: 13 }}>{slideIdx + 1} / {lesson.slides.length}</span>
              <button onClick={restart} title="Restart lesson" style={{
                background: "none", border: "none", cursor: "pointer", padding: 4,
                color: T.textMuted, display: "flex", alignItems: "center",
              }}>
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
            <motion.div animate={{ width: `${((slideIdx + 1) / lesson.slides.length) * 100}%` }}
              style={{ height: "100%", background: T.accentGrad, borderRadius: 2 }} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{
        maxWidth: 600, margin: "0 auto", padding: "48px 24px 140px", minHeight: "calc(100vh - 180px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <SlideComponent slide={currentSlide} onComplete={celebrate} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer nav */}
      <footer style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(9,9,11,0.9)",
        backdropFilter: "blur(12px)", borderTop: `1px solid ${T.border}`, padding: "16px 24px",
      }}>
        <div style={{ display: "flex", gap: 12, maxWidth: 400, margin: "0 auto" }}>
          <button onClick={prev} disabled={isFirst} style={{
            width: 48, height: 48, borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent",
            color: isFirst ? "#27272a" : T.textSecondary, cursor: isFirst ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={isLast ? restart : next} style={{
            flex: 1, height: 48, borderRadius: 10, border: "none",
            background: isLast ? "rgba(255,255,255,0.1)" : T.accentGrad,
            color: "white", fontSize: 15, fontWeight: 500,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            {isLast ? (
              <><RotateCcw size={16} /> Restart</>
            ) : (
              <>Continue <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}