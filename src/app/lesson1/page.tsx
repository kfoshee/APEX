"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, X, Play, RotateCcw, Database, Sparkles, AlertTriangle, DollarSign, Users, Hash, Coffee, ShoppingBag, TrendingUp, Lightbulb, Award, Zap, ArrowDown, Eye } from "lucide-react";

const ACCENT = "#6366f1";
const ACCENT_GRAD = "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)";
const SUCCESS = "#10b981";
const ERROR = "#ef4444";
const ORANGE = "#f97316";
const SURFACE = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const PINK = "#ec4899";
const BLUE = "#3b82f6";
const GREEN = "#22c55e";
const YELLOW = "#eab308";

// Animated counter
function AnimatedNumber({ value, color }: { value: number; color: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = display;
    const diff = value - start;
    const steps = 20;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDisplay(Math.round(start + (diff * step) / steps));
      if (step >= steps) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [value]);
  return <span style={{ color }}>{display.toLocaleString()}</span>;
}

// Customer avatar
function Avatar({ name, color, size = 48, active, excluded, count }: {
  name: string; color: string; size?: number; active?: boolean; excluded?: boolean; count?: number
}) {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <motion.div
      animate={{ scale: active ? 1.1 : 1, opacity: excluded ? 0.3 : 1, y: active ? -8 : 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}
    >
      <div style={{
        width: size, height: size, borderRadius: size / 3,
        background: excluded ? `${ERROR}30` : active ? `${color}30` : "rgba(255,255,255,0.05)",
        border: `3px solid ${excluded ? ERROR : active ? color : "rgba(255,255,255,0.1)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.35, fontWeight: 700, color: excluded ? ERROR : active ? color : "#64748b",
      }}>
        {initials}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: excluded ? ERROR : active ? color : "#64748b" }}>{name}</span>
      {excluded && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{
            position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%",
            background: ERROR, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          <X size={12} color="white" strokeWidth={3} />
        </motion.div>
      )}
      {count !== undefined && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{
            position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%",
            background: SUCCESS, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "white",
          }}>
          {count}
        </motion.div>
      )}
    </motion.div>
  );
}

// ========== SLIDE 1: DRAMATIC HOOK ==========
function SlideHook() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ maxWidth: 500, textAlign: "center" }}>
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: 60 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 40, height: 40, borderRadius: "50%", border: "3px solid transparent",
                borderTopColor: ACCENT, margin: "0 auto"
              }} />
          </motion.div>
        )}

        {phase >= 1 && phase < 3 && (
          <motion.div key="reveal" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                padding: "16px 24px", background: `${ERROR}15`, border: `2px solid ${ERROR}`,
                borderRadius: 16, marginBottom: 32, display: "inline-block",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <AlertTriangle size={28} color={ERROR} />
                <span style={{ color: ERROR, fontSize: 15, fontWeight: 700 }}>COSTLY MISTAKE DETECTED</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 48, fontWeight: 800, color: "white", marginBottom: 20, lineHeight: 1.1 }}>
              <span style={{ color: ERROR }}>$47,000</span><br />wasted.
            </motion.h1>

            {phase >= 2 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.7 }}>
                A junior analyst miscounted customers.<br />
                Marketing targeted the wrong audience.
              </motion.p>
            )}
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div key="question" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "white", marginBottom: 24 }}>
              Would you have caught the error?
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, lineHeight: 1.7 }}>
              Let's find out. This lesson takes 3 minutes.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ========== SLIDE 2: SCENARIO SETUP ==========
function SlideScenario() {
  return (
    <div style={{ maxWidth: 500 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{
          display: "inline-flex", padding: "8px 16px", background: `${BLUE}15`, border: `1px solid ${BLUE}30`,
          borderRadius: 8, marginBottom: 24,
        }}>
          <Coffee size={18} color={BLUE} style={{ marginRight: 8 }} />
          <span style={{ color: BLUE, fontSize: 14, fontWeight: 600 }}>YOUR SCENARIO</span>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: "white", marginBottom: 16, lineHeight: 1.3 }}>
          You're the data analyst at a coffee chain.
        </h1>

        <p style={{ color: "#94a3b8", fontSize: 17, lineHeight: 1.8, marginBottom: 32 }}>
          The CEO walks in and asks:<br />
          <span style={{ color: "white", fontStyle: "italic" }}>"How many customers did we serve last week?"</span>
        </p>

        <div style={{
          padding: 24, background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 16,
        }}>
          <div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
            You have access to:
          </div>
          <div style={{
            padding: "16px 20px", background: "rgba(99,102,241,0.1)", border: `1px solid ${ACCENT}30`,
            borderRadius: 10, display: "flex", alignItems: "center", gap: 12,
          }}>
            <Database size={24} color={ACCENT} />
            <div>
              <code style={{ color: ACCENT, fontSize: 16, fontWeight: 600 }}>orders</code>
              <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>Every transaction recorded</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ========== SLIDE 3: SEE THE DATA ==========
function SlideData({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const orders = [
    { id: 1, customer: "Emma", color: PINK, item: "Latte", price: "$5.50" },
    { id: 2, customer: "James", color: BLUE, item: "Espresso", price: "$3.00" },
    { id: 3, customer: "Emma", color: PINK, item: "Croissant", price: "$4.25" },
    { id: 4, customer: "Sofia", color: GREEN, item: "Mocha", price: "$6.00" },
    { id: 5, customer: "James", color: BLUE, item: "Muffin", price: "$3.50" },
  ];

  const start = () => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStep(i);
      if (i >= orders.length) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 600);
  };

  const visibleOrders = orders.slice(0, step);
  const uniqueCustomers = [...new Set(visibleOrders.map(o => o.customer))];

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>
          Watch the orders come in
        </h2>
        <p style={{ color: "#64748b", fontSize: 15 }}>
          Pay attention to who's ordering.
        </p>
      </div>

      {/* Customer avatars row */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 24, padding: "24px 16px",
        background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, marginBottom: 16,
      }}>
        {uniqueCustomers.length === 0 ? (
          <div style={{ color: "#475569", fontSize: 14, padding: 20 }}>Customers will appear here...</div>
        ) : (
          uniqueCustomers.map((name, i) => {
            const customer = orders.find(o => o.customer === name)!;
            const orderCount = visibleOrders.filter(o => o.customer === name).length;
            return (
              <motion.div key={name} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }}>
                <Avatar name={name} color={customer.color} size={56} active count={orderCount} />
              </motion.div>
            );
          })
        )}
      </div>

      {/* Orders list */}
      <div style={{
        background: "#0c0c0f", border: `1px solid ${BORDER}`, borderRadius: 12,
        overflow: "hidden", marginBottom: 24, minHeight: 200,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1.2fr 80px", borderBottom: `1px solid ${BORDER}` }}>
          {["#", "Customer", "Item", "Price"].map((col, i) => (
            <div key={i} style={{
              padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#64748b",
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>{col}</div>
          ))}
        </div>
        <div style={{ padding: 8 }}>
          {visibleOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20, backgroundColor: `${order.color}20` }}
              animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
              transition={{ duration: 0.4 }}
              style={{
                display: "grid", gridTemplateColumns: "60px 1fr 1.2fr 80px",
                padding: "10px 12px", borderRadius: 8,
              }}
            >
              <div style={{ fontFamily: "monospace", fontSize: 13, color: "#64748b" }}>{order.id}</div>
              <div style={{ fontSize: 14, color: order.color, fontWeight: 600 }}>{order.customer}</div>
              <div style={{ fontSize: 14, color: "#94a3b8" }}>{order.item}</div>
              <div style={{ fontSize: 14, color: "#94a3b8", fontFamily: "monospace" }}>{order.price}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {step > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, padding: 16, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: "white" }}>{step}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>orders</div>
          </div>
          <div style={{ flex: 1, padding: 16, background: `${SUCCESS}10`, border: `1px solid ${SUCCESS}30`, borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: SUCCESS }}>{uniqueCustomers.length}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>unique people</div>
          </div>
        </motion.div>
      )}

      {step === 0 && (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={start}
          style={{
            width: "100%", padding: "16px", background: ACCENT_GRAD, border: "none", borderRadius: 12,
            color: "white", fontSize: 16, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
          <Play size={20} fill="white" /> Watch Orders
        </motion.button>
      )}

      {step >= orders.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            padding: "16px 20px", background: `${YELLOW}10`, border: `1px solid ${YELLOW}30`,
            borderRadius: 12, display: "flex", alignItems: "center", gap: 12,
          }}>
          <Lightbulb size={22} color={YELLOW} />
          <span style={{ color: "#fef08a", fontSize: 15 }}>
            Notice: <strong>5 orders</strong>, but only <strong>3 different people</strong>
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ========== SLIDE 4: THE TRAP ==========
function SlideTrap({ onComplete }: { onComplete: () => void }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleChoice = (c: number) => {
    setChoice(c);
    setTimeout(() => setRevealed(true), 500);
    setTimeout(onComplete, 1500);
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "white", marginBottom: 12 }}>
          The CEO asks: "How many customers?"
        </h2>
        <p style={{ color: "#64748b", fontSize: 16, marginBottom: 32 }}>
          Based on that data, what would you report?
        </p>

        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {[
            { value: 5, label: "5 customers", sub: "(count all rows)" },
            { value: 3, label: "3 customers", sub: "(count unique people)" },
          ].map((opt, i) => (
            <motion.button
              key={i}
              whileHover={choice === null ? { scale: 1.03 } : {}}
              whileTap={choice === null ? { scale: 0.97 } : {}}
              onClick={() => choice === null && handleChoice(opt.value)}
              style={{
                flex: 1, padding: "28px 20px", borderRadius: 16,
                background: choice === opt.value
                  ? (revealed ? (opt.value === 3 ? `${SUCCESS}20` : `${ERROR}20`) : `${ACCENT}20`)
                  : SURFACE,
                border: `2px solid ${choice === opt.value
                    ? (revealed ? (opt.value === 3 ? SUCCESS : ERROR) : ACCENT)
                    : BORDER
                  }`,
                cursor: choice === null ? "pointer" : "default",
                textAlign: "center",
              }}
            >
              <div style={{
                fontSize: 48, fontWeight: 800, marginBottom: 8,
                color: choice === opt.value
                  ? (revealed ? (opt.value === 3 ? SUCCESS : ERROR) : ACCENT)
                  : "white",
              }}>{opt.value}</div>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>{opt.label}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{opt.sub}</div>
            </motion.button>
          ))}
        </div>

        {revealed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {choice === 5 ? (
              <div style={{
                padding: 20, background: `${ERROR}10`, border: `1px solid ${ERROR}40`,
                borderRadius: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <AlertTriangle size={24} color={ERROR} />
                  <span style={{ color: ERROR, fontWeight: 700, fontSize: 18 }}>That's the trap!</span>
                </div>
                <p style={{ color: "#fca5a5", fontSize: 15, margin: 0, lineHeight: 1.6 }}>
                  You counted <strong>orders</strong>, not <strong>customers</strong>.
                  Emma and James each ordered twice—they're not 4 different people!
                </p>
              </div>
            ) : (
              <div style={{
                padding: 20, background: `${SUCCESS}10`, border: `1px solid ${SUCCESS}40`,
                borderRadius: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Check size={24} color={SUCCESS} />
                  <span style={{ color: SUCCESS, fontWeight: 700, fontSize: 18 }}>You got it!</span>
                </div>
                <p style={{ color: "#6ee7b7", fontSize: 15, margin: 0, lineHeight: 1.6 }}>
                  You correctly identified that only 3 unique people made purchases.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ========== SLIDE 5: THE KEY CONCEPT ==========
function SlideConcept() {
  const [step, setStep] = useState(0);

  return (
    <div style={{ maxWidth: 500 }}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{
              padding: "12px 20px", background: `${YELLOW}15`, border: `1px solid ${YELLOW}30`,
              borderRadius: 10, marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 10,
            }}>
              <Zap size={18} color={YELLOW} />
              <span style={{ color: YELLOW, fontWeight: 600 }}>KEY INSIGHT</span>
            </div>

            <h2 style={{ fontSize: 32, fontWeight: 700, color: "white", marginBottom: 20, lineHeight: 1.3 }}>
              Before you count, ask:<br />
              <span style={{ color: ACCENT }}>"What am I counting?"</span>
            </h2>

            <p style={{ color: "#94a3b8", fontSize: 17, lineHeight: 1.8, marginBottom: 32 }}>
              The <strong style={{ color: "white" }}>grain</strong> of a table tells you what one row represents.
              Get this wrong, and everything downstream is wrong.
            </p>

            <button onClick={() => setStep(1)} style={{
              padding: "14px 32px", background: ACCENT_GRAD, border: "none", borderRadius: 12,
              color: "white", fontSize: 16, fontWeight: 600, cursor: "pointer",
            }}>
              Show me the difference
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 24, textAlign: "center" }}>
              Two ways to count the same data
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* COUNT(*) */}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                style={{
                  padding: 24, background: `${ERROR}08`, border: `1px solid ${ERROR}30`,
                  borderRadius: 16, textAlign: "center",
                }}>
                <code style={{ color: ERROR, fontSize: 14, fontWeight: 600 }}>COUNT(*)</code>
                <div style={{ fontSize: 56, fontWeight: 800, color: ERROR, margin: "16px 0" }}>5</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {[PINK, BLUE, PINK, GREEN, BLUE].map((c, i) => (
                    <motion.div key={i} initial={{ width: 0 }} animate={{ width: "100%" }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      style={{ height: 8, background: c, borderRadius: 4, opacity: 0.7 }} />
                  ))}
                </div>
                <div style={{ color: "#fca5a5", fontSize: 13 }}>Counts every row</div>
                <div style={{ color: ERROR, fontSize: 12, marginTop: 8, fontWeight: 600 }}>
                  ⚠️ WRONG for "customers"
                </div>
              </motion.div>

              {/* COUNT DISTINCT */}
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                style={{
                  padding: 24, background: `${SUCCESS}08`, border: `1px solid ${SUCCESS}30`,
                  borderRadius: 16, textAlign: "center",
                }}>
                <code style={{ color: SUCCESS, fontSize: 14, fontWeight: 600 }}>COUNT(DISTINCT)</code>
                <div style={{ fontSize: 56, fontWeight: 800, color: SUCCESS, margin: "16px 0" }}>3</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {[PINK, BLUE, GREEN].map((c, i) => (
                    <motion.div key={i} initial={{ width: 0 }} animate={{ width: "100%" }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      style={{ height: 8, background: c, borderRadius: 4 }} />
                  ))}
                </div>
                <div style={{ color: "#6ee7b7", fontSize: 13 }}>Counts unique values only</div>
                <div style={{ color: SUCCESS, fontSize: 12, marginTop: 8, fontWeight: 600 }}>
                  ✓ CORRECT for "customers"
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ========== SLIDE 6: ANIMATED COUNT ==========
function SlideCountDemo({ onComplete }: { onComplete: () => void }) {
  const [mode, setMode] = useState<"idle" | "running" | "done">("idle");
  const [step, setStep] = useState(0);
  const [excluded, setExcluded] = useState<number[]>([]);
  const [result, setResult] = useState(0);

  const people = [
    { name: "Emma", color: PINK },
    { name: "James", color: BLUE },
    { name: "Emma", color: PINK },
    { name: "Sofia", color: GREEN },
    { name: "James", color: BLUE },
  ];

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
          setExcluded(prev => [...prev, i]);
        } else {
          seen.add(people[i].name);
          setResult(seen.size);
        }
        i++;
      } else {
        clearInterval(interval);
        setMode("done");
        setTimeout(onComplete, 800);
      }
    }, 700);
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>
          Watch COUNT(DISTINCT) in action
        </h2>
        <p style={{ color: "#64748b", fontSize: 15 }}>
          See exactly what gets counted and what gets skipped.
        </p>
      </div>

      {/* Avatars */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 16, padding: "32px 20px",
        background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, marginBottom: 24,
      }}>
        {people.map((p, i) => (
          <Avatar
            key={i}
            name={p.name}
            color={p.color}
            size={52}
            active={i < step && !excluded.includes(i)}
            excluded={excluded.includes(i)}
          />
        ))}
      </div>

      {/* Result */}
      {mode !== "idle" && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{
            padding: "24px 56px", background: `${SUCCESS}15`, border: `2px solid ${SUCCESS}`,
            borderRadius: 20, textAlign: "center",
          }}>
            <motion.div key={result} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
              style={{ fontSize: 64, fontWeight: 800, color: SUCCESS }}>{result}</motion.div>
            <div style={{ color: "#6ee7b7", fontSize: 14 }}>unique customers</div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      {mode !== "idle" && step >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            display: "flex", justifyContent: "center", gap: 24, marginBottom: 24,
            fontSize: 13, color: "#94a3b8",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 4, background: SUCCESS }} />
            Counted
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 4, background: ERROR }} />
            Skipped (duplicate)
          </div>
        </motion.div>
      )}

      {/* Button */}
      {mode === "idle" && (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={run}
          style={{
            width: "100%", padding: "16px", background: ACCENT_GRAD, border: "none", borderRadius: 12,
            color: "white", fontSize: 16, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
          <Play size={20} fill="white" /> Run COUNT(DISTINCT customer)
        </motion.button>
      )}

      {mode === "done" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            padding: "16px 20px", background: `${SUCCESS}10`, border: `1px solid ${SUCCESS}30`,
            borderRadius: 12, textAlign: "center", color: "#6ee7b7", fontSize: 15,
          }}>
          Emma and James were each counted only <strong>once</strong>, even though they ordered twice.
        </motion.div>
      )}
    </div>
  );
}

// ========== SLIDE 7: FINAL TEST ==========
function SlideFinalTest({ onCorrect }: { onCorrect: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 500 }}>
      <div style={{
        padding: "12px 20px", background: `${ORANGE}15`, border: `1px solid ${ORANGE}30`,
        borderRadius: 10, marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 10,
      }}>
        <Award size={18} color={ORANGE} />
        <span style={{ color: ORANGE, fontWeight: 600 }}>FINAL TEST</span>
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 12 }}>
        Back to the CEO's question:
      </h2>
      <p style={{ color: "white", fontSize: 18, fontStyle: "italic", marginBottom: 8 }}>
        "How many customers did we serve last week?"
      </p>
      <p style={{ color: "#64748b", fontSize: 15, marginBottom: 28 }}>
        Which SQL do you run?
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { sql: "SELECT COUNT(*) FROM orders", correct: false },
          { sql: "SELECT COUNT(DISTINCT customer_id) FROM orders", correct: true },
        ].map((opt, i) => {
          const isCorrect = opt.correct;
          const isSelected = i === selected;
          const showResult = selected !== null;

          return (
            <motion.button
              key={i}
              whileHover={!showResult ? { borderColor: "rgba(255,255,255,0.2)" } : {}}
              onClick={() => {
                if (showResult) return;
                setSelected(i);
                if (opt.correct) setTimeout(onCorrect, 500);
              }}
              style={{
                padding: "20px", borderRadius: 14, textAlign: "left",
                background: showResult && isCorrect ? `${SUCCESS}15` : showResult && isSelected ? `${ERROR}15` : SURFACE,
                border: `2px solid ${showResult && isCorrect ? SUCCESS : showResult && isSelected ? ERROR : BORDER}`,
                cursor: showResult ? "default" : "pointer",
              }}
            >
              <code style={{
                fontSize: 15,
                color: showResult && isCorrect ? SUCCESS : showResult && isSelected ? ERROR : "white",
              }}>
                {opt.sql}
              </code>
              {showResult && isCorrect && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: SUCCESS, fontSize: 14 }}>
                  <Check size={18} /> This counts unique customers correctly!
                </motion.div>
              )}
              {showResult && isSelected && !isCorrect && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: ERROR, fontSize: 14 }}>
                  <X size={18} /> This counts orders, not customers
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ========== SLIDE 8: VICTORY ==========
function SlideVictory() {
  return (
    <div style={{ textAlign: "center", maxWidth: 460 }}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10 }}
        style={{
          width: 88, height: 88, borderRadius: 28,
          background: `linear-gradient(135deg, ${SUCCESS} 0%, #059669 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px", boxShadow: `0 20px 50px ${SUCCESS}50`,
        }}
      >
        <Award size={44} color="white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: 36, fontWeight: 800, color: "white", marginBottom: 12 }}
      >
        You're ready.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ color: "#94a3b8", fontSize: 17, marginBottom: 40, lineHeight: 1.7 }}
      >
        You won't make the $47,000 mistake.<br />
        That puts you ahead of many working analysts.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          padding: 28, background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 20, textAlign: "left",
        }}
      >
        <div style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
          Your new mental checklist
        </div>
        {[
          { icon: Eye, text: "Check the grain first" },
          { icon: Hash, text: "COUNT(*) = all rows" },
          { icon: Users, text: "COUNT(DISTINCT) = unique values" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: `${ACCENT}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <item.icon size={18} color={ACCENT} />
            </div>
            <span style={{ color: "white", fontSize: 16, fontWeight: 500 }}>{item.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ========== MAIN ==========
export default function Lesson1Page() {
  const [started, setStarted] = useState(false);
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const slides = ["hook", "scenario", "data", "trap", "concept", "demo", "test", "victory"];

  const start = async () => {
    if (!file && text.length < 50) return;
    setLoading(true);
    try {
      const form = new FormData();
      if (file) form.append("resumeFile", file);
      else form.append("resumeText", text);
      await fetch("/api/lesson1", { method: "POST", body: form });
      setStarted(true);
    } catch (e) { }
    finally { setLoading(false); }
  };

  const celebrate = () => { setSuccess(true); setTimeout(() => setSuccess(false), 1000); };
  const next = () => slide < slides.length - 1 && setSlide(s => s + 1);
  const prev = () => slide > 0 && setSlide(s => s - 1);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "ArrowRight") next(); else if (e.key === "ArrowLeft") prev(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [slide]);

  const renderSlide = () => {
    switch (slides[slide]) {
      case "hook": return <SlideHook />;
      case "scenario": return <SlideScenario />;
      case "data": return <SlideData onComplete={celebrate} />;
      case "trap": return <SlideTrap onComplete={celebrate} />;
      case "concept": return <SlideConcept />;
      case "demo": return <SlideCountDemo onComplete={celebrate} />;
      case "test": return <SlideFinalTest onCorrect={celebrate} />;
      case "victory": return <SlideVictory />;
    }
  };

  if (!started) {
    return (
      <div style={{
        minHeight: "100vh", background: "#09090b", fontFamily: "'Inter', -apple-system, sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ maxWidth: 380, padding: 24 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: ACCENT_GRAD,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
            }}>
              <Database size={26} color="white" />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 600, color: "white", marginBottom: 8 }}>Data Foundations</h1>
            <p style={{ color: "#64748b", fontSize: 15 }}>Interactive lesson • 3 min</p>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid transparent", borderTopColor: ACCENT }} />
            </div>
          ) : (
            <>
              <div onClick={() => fileRef.current?.click()}
                style={{
                  padding: 28, borderRadius: 12, border: `1px dashed ${file ? SUCCESS : BORDER}`,
                  cursor: "pointer", marginBottom: 16, background: file ? `${SUCCESS}05` : "transparent",
                }}>
                <input ref={fileRef} type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} style={{ display: "none" }} />
                <div style={{
                  width: 40, height: 40, borderRadius: 10, margin: "0 auto 12px",
                  background: file ? SUCCESS : "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {file ? <Check size={20} color="white" /> : <Database size={20} color="#64748b" />}
                </div>
                <div style={{ color: file ? SUCCESS : "white", fontWeight: 500, fontSize: 14, textAlign: "center" }}>
                  {file ? file.name : "Upload Resume (PDF)"}
                </div>
              </div>

              <div style={{ color: "#475569", fontSize: 13, textAlign: "center", marginBottom: 16 }}>or</div>

              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste resume text..."
                style={{
                  width: "100%", minHeight: 80, padding: 14, borderRadius: 10, border: `1px solid ${BORDER}`,
                  background: "rgba(255,255,255,0.02)", color: "white", fontSize: 14, resize: "none", outline: "none", marginBottom: 20,
                }} />

              <button onClick={start} disabled={!file && text.length < 50}
                style={{
                  width: "100%", padding: "14px 20px", borderRadius: 10, border: "none",
                  background: (file || text.length >= 50) ? ACCENT_GRAD : "rgba(255,255,255,0.1)",
                  color: "white", fontSize: 15, fontWeight: 500,
                  cursor: (file || text.length >= 50) ? "pointer" : "not-allowed",
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

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {success && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }} transition={{ duration: 1 }}
          style={{
            position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100,
            background: `radial-gradient(circle at 50% 50%, ${SUCCESS}25 0%, transparent 50%)`,
          }} />
      )}

      <header style={{
        position: "sticky", top: 0, zIndex: 50, background: "rgba(9, 9, 11, 0.85)",
        backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ color: "#64748b", fontSize: 13, fontWeight: 500 }}>Data Foundations</span>
            <span style={{ color: "#64748b", fontSize: 13 }}>{slide + 1} / {slides.length}</span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
            <motion.div animate={{ width: `${((slide + 1) / slides.length) * 100}%` }}
              style={{ height: "100%", background: ACCENT_GRAD, borderRadius: 2 }} />
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: 600, margin: "0 auto", padding: "48px 24px 140px", minHeight: "calc(100vh - 180px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(9, 9, 11, 0.9)",
        backdropFilter: "blur(12px)", borderTop: `1px solid ${BORDER}`, padding: "16px 24px",
      }}>
        <div style={{ display: "flex", gap: 12, maxWidth: 400, margin: "0 auto" }}>
          <button onClick={prev} disabled={slide === 0}
            style={{
              width: 48, height: 48, borderRadius: 10, border: `1px solid ${BORDER}`, background: "transparent",
              color: slide === 0 ? "#27272a" : "#94a3b8", cursor: slide === 0 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} disabled={slide === slides.length - 1}
            style={{
              flex: 1, height: 48, borderRadius: 10, border: "none",
              background: slide === slides.length - 1 ? "rgba(255,255,255,0.1)" : ACCENT_GRAD,
              color: "white", fontSize: 15, fontWeight: 500,
              cursor: slide === slides.length - 1 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
            Continue <ChevronRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}