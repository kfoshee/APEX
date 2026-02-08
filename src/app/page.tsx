"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, X, Upload } from "lucide-react";

type SlideType = "concept" | "example" | "checkpoint" | "summary";
type Slide = {
  id: string;
  type: SlideType;
  headline: string;
  bullets: string[];
  code: string;
  prompt: string;
  expected: string;
};
type Deck = { theme: string; title: string; slides: Slide[] };

const smooth: [number, number, number, number] = [0.16, 1, 0.3, 1];

function normalize(s: string) {
  return (s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export default function Lesson1Page() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checkState, setCheckState] = useState<"idle" | "correct" | "wrong">("idle");

  const slide = deck?.slides?.[idx];

  const progress = useMemo(() => {
    if (!deck?.slides?.length) return 0;
    return Math.round(((idx + 1) / deck.slides.length) * 100);
  }, [idx, deck?.slides?.length]);

  async function extractFromPdf(file: File) {
    setErr(null);
    setExtracting(true);

    try {
      const form = new FormData();
      form.append("resumeFile", file);

      const res = await fetch("/api/extract-resume", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || data?.error || "Extraction failed");

      setResumeText(data.resumeText || "");
      if (!data.resumeText || data.resumeText.trim().length < 50) {
        throw new Error("Extraction returned too little text. Try pasting text manually.");
      }
    } catch (e: any) {
      setErr(e?.message || "Failed to extract text");
    } finally {
      setExtracting(false);
    }
  }

  async function onPickFile(file: File | null) {
    if (!file) return;
    setDeck(null);
    setIdx(0);
    setAnswer("");
    setCheckState("idle");

    setResumeFileName(file.name);
    await extractFromPdf(file);
  }

  async function generateDeck() {
    setLoading(true);
    setErr(null);
    setDeck(null);
    setIdx(0);
    setAnswer("");
    setCheckState("idle");

    try {
      const res = await fetch("/api/lesson1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Request failed");
      setDeck(data);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function goNext() {
    if (!deck) return;
    if (slide?.type === "checkpoint" && checkState !== "correct") return;
    setIdx((v) => Math.min(v + 1, deck.slides.length - 1));
    setAnswer("");
    setCheckState("idle");
  }

  function goPrev() {
    if (!deck) return;
    setIdx((v) => Math.max(v - 1, 0));
    setAnswer("");
    setCheckState("idle");
  }

  function checkAnswer() {
    if (!slide || slide.type !== "checkpoint") return;

    const expected = normalize(slide.expected);
    const got = normalize(answer);

    const ok =
      got === expected ||
      (expected.includes("count") && got.includes("count") && got.includes("distinct")) ||
      (expected === "count distinct" && got.includes("count") && got.includes("distinct"));

    setCheckState(ok ? "correct" : "wrong");
  }

  const canGenerate = resumeText.trim().length >= 50 && !extracting;

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", padding: "40px 20px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ color: "#71717a", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Lesson 1 Generator
            </div>
            <div style={{ color: "white", fontSize: 34, fontWeight: 900, letterSpacing: "-0.03em", marginTop: 10 }}>
              Upload PDF → Personalized slideshow
            </div>
            <div style={{ color: "#a1a1aa", fontSize: 15, marginTop: 10, maxWidth: 560, lineHeight: 1.6 }}>
              PDF text extraction runs on Google Document AI. Then we generate Lesson 1 slides.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: "#a1a1aa", fontSize: 13 }}>Progress</div>
            <div style={{ width: 160, height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: smooth }}
                style={{ height: "100%", background: "#ff6b6b" }}
              />
            </div>
            <div style={{ color: "#a1a1aa", fontSize: 13, minWidth: 36, textAlign: "right" }}>{progress}%</div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "white",
              cursor: extracting ? "default" : "pointer",
              width: "fit-content",
              opacity: extracting ? 0.7 : 1,
            }}
          >
            <Upload size={16} />
            {extracting ? "Extracting PDF…" : "Upload resume PDF"}
            <input
              type="file"
              accept="application/pdf,.pdf"
              style={{ display: "none" }}
              onChange={(e) => onPickFile(e.target.files?.[0] || null)}
              disabled={extracting}
            />
          </label>

          {resumeFileName && (
            <div style={{ color: "#a1a1aa", fontSize: 13 }}>
              File: <span style={{ color: "white" }}>{resumeFileName}</span>
            </div>
          )}

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Extracted resume text will appear here… (you can also edit/paste)"
            style={{
              width: "100%",
              minHeight: 140,
              resize: "vertical",
              padding: 16,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "white",
              fontSize: 14,
              lineHeight: 1.6,
              outline: "none",
            }}
          />

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <motion.button
              onClick={generateDeck}
              disabled={loading || !canGenerate}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                background: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "12px 18px",
                fontWeight: 700,
                cursor: loading ? "default" : "pointer",
                opacity: loading || !canGenerate ? 0.6 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Generate Lesson 1 <ArrowRight size={16} />
            </motion.button>

            {err && <div style={{ color: "#fca5a5", fontSize: 13 }}>{err}</div>}
            {deck && (
              <div style={{ color: "#a1a1aa", fontSize: 13 }}>
                Theme: <span style={{ color: "white" }}>{deck.theme}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          {!deck && <div style={{ color: "#71717a", fontSize: 14, padding: "28px 2px" }}>Generate a deck to preview slides here.</div>}

          {deck && slide && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: smooth }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 24,
                    padding: 24,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      {slide.type}
                    </div>
                    <div style={{ color: "#71717a", fontSize: 12 }}>
                      Slide {idx + 1} / {deck.slides.length}
                    </div>
                  </div>

                  <div style={{ color: "white", fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", marginTop: 10 }}>
                    {slide.headline}
                  </div>

                  {slide.bullets?.length > 0 && (
                    <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                      {slide.bullets.map((b, i) => (
                        <motion.div
                          key={`${slide.id}-b-${i}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * i }}
                          style={{
                            color: "#d4d4d8",
                            fontSize: 15,
                            lineHeight: 1.5,
                            padding: "10px 12px",
                            borderRadius: 14,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {b}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {slide.type === "example" && slide.code && (
                    <pre
                      style={{
                        marginTop: 16,
                        background: "#0a0a0a",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        padding: 16,
                        overflowX: "auto",
                        color: "#10b981",
                        fontSize: 13,
                        lineHeight: 1.6,
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      }}
                    >
                      {slide.code}
                    </pre>
                  )}

                  {slide.type === "checkpoint" && (
                    <div style={{ marginTop: 18 }}>
                      <div style={{ color: "#a1a1aa", fontSize: 14, lineHeight: 1.6 }}>{slide.prompt}</div>

                      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                        <input
                          value={answer}
                          onChange={(e) => {
                            setAnswer(e.target.value);
                            setCheckState("idle");
                          }}
                          placeholder="Your answer…"
                          style={{
                            flex: 1,
                            minWidth: 240,
                            padding: "12px 14px",
                            borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.03)",
                            color: "white",
                            fontSize: 14,
                            outline: "none",
                          }}
                        />

                        <motion.button
                          onClick={checkAnswer}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            background: "rgba(255,255,255,0.08)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 14,
                            padding: "12px 14px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          Check
                          {checkState === "correct" && <Check size={16} />}
                          {checkState === "wrong" && <X size={16} />}
                        </motion.button>
                      </div>

                      {checkState === "correct" && <div style={{ marginTop: 10, color: "#10b981", fontSize: 13, fontWeight: 700 }}>Correct. You can continue.</div>}
                      {checkState === "wrong" && <div style={{ marginTop: 10, color: "#fca5a5", fontSize: 13, fontWeight: 700 }}>Not quite. Try again.</div>}
                      {checkState === "idle" && <div style={{ marginTop: 10, color: "#71717a", fontSize: 13 }}>You must answer to proceed.</div>}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <motion.button
                  onClick={goPrev}
                  disabled={idx === 0}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 999,
                    padding: "10px 14px",
                    fontWeight: 700,
                    opacity: idx === 0 ? 0.5 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ArrowLeft size={16} />
                  Back
                </motion.button>

                <motion.button
                  onClick={goNext}
                  disabled={idx === deck.slides.length - 1 || (slide.type === "checkpoint" && checkState !== "correct")}
                  style={{
                    background: "#ff6b6b",
                    color: "white",
                    border: "none",
                    borderRadius: 999,
                    padding: "10px 14px",
                    fontWeight: 900,
                    opacity: idx === deck.slides.length - 1 || (slide.type === "checkpoint" && checkState !== "correct") ? 0.6 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Next
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {loading && <div style={{ marginTop: 12, color: "#71717a", fontSize: 13 }}>Generating personalized slides…</div>}
      </div>
    </main>
  );
}