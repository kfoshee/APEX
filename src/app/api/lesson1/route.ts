export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ExternalAccountClient, GoogleAuth } from "google-auth-library";
import { getVercelOidcToken } from "@vercel/oidc";
import { jsonrepair } from "jsonrepair";

/* ═══════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════ */

const LOCATION = process.env.GCP_LOCATION || "us-central1";
const MODEL = process.env.VERTEX_MODEL || "gemini-2.5-flash";
const DOCAI_LOCATION = process.env.DOCAI_LOCATION || "us";
const DOCAI_PROCESSOR_ID = process.env.DOCAI_PROCESSOR_ID || "776c52b2d795c6e3";

/* ═══════════════════════════════════════════════════════════
   TYPES — matches the page's Zod schema exactly
   ═══════════════════════════════════════════════════════════ */

interface OrderRow {
  id: number;
  customer: string;
  color?: string;
  item: string;
  price: string;
}

interface QuizOption {
  label: string;
  value: string | number;
  correct?: boolean;
}

interface MatchingPair {
  left: string;
  right: string;
}

interface Visual {
  type: "live_table" | "count_demo" | "matching" | "sql_playground";
  orders?: OrderRow[];
  revealSpeed?: number;
  people?: { name: string; color: string }[];
  pairs?: MatchingPair[];
  shuffleRight?: boolean;
  defaultQuery?: string;
  hint?: string;
}

interface Slide {
  id: string;
  type: "intro" | "concept" | "quiz" | "checkpoint" | "summary";
  title?: string;
  subtitle?: string;
  body?: string;
  badge?: string;
  badgeColor?: string;
  badgeIcon?: string;
  visual?: Visual;
  options?: QuizOption[];
  checklist?: { icon?: string; text: string }[];
  phases?: { content: string; delay?: number }[];
  autoAdvance?: boolean;
  successMessage?: string;
  failureMessage?: string;
  remediation?: string;
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  slides: Slide[];
}

/* ═══════════════════════════════════════════════════════════
   GEMINI SYSTEM PROMPT
   ═══════════════════════════════════════════════════════════ */

const SYSTEM = `You are creating an interactive data analytics lesson. Return ONLY valid JSON.

Create a lesson teaching: metrics with inclusion rules, dataset grain, and COUNT vs COUNT DISTINCT.

Return exactly this structure with 10 slides:
{
  "theme": "Data Foundations",
  "title": "Lesson 1: Data Foundations",
  "slides": [
    { "id": "1", "type": "intro", "headline": "Welcome to Data Foundations", "subheadline": "Master the concepts every analyst needs", "bullets": ["Define metrics", "Understand grain", "Master SQL counting"] },
    { "id": "2", "type": "concept", "headline": "What is a Metric?", "bullets": ["KEY: A metric measures something specific", "Every metric needs inclusion rules", "Example: Monthly Active Users = users who logged in this month"] },
    { "id": "3", "type": "interactive", "headline": "See Data Build Up", "subheadline": "Watch how orders accumulate in a table", "visual": { "type": "live_table" } },
    { "id": "4", "type": "concept", "headline": "Understanding Grain", "bullets": ["KEY: Grain = what ONE row represents", "Orders table: one row = one order", "Customers table: one row = one customer"] },
    { "id": "5", "type": "quiz", "headline": "Quick Check", "prompt": "In a table where each row is one order, what is the grain?", "options": ["Customer", "Product", "Order", "Date"], "expected": "Order" },
    { "id": "6", "type": "interactive", "headline": "COUNT vs COUNT DISTINCT", "subheadline": "Click to see the difference in action", "visual": { "type": "count_demo" } },
    { "id": "7", "type": "interactive", "headline": "Try It Yourself", "subheadline": "Edit and run this SQL query", "visual": { "type": "sql_playground" } },
    { "id": "8", "type": "interactive", "headline": "Match the Concepts", "visual": { "type": "matching", "pairs": [{ "left": "COUNT(*)", "right": "Counts all rows" }, { "left": "COUNT DISTINCT", "right": "Counts unique values" }, { "left": "Grain", "right": "What one row represents" }] } },
    { "id": "9", "type": "checkpoint", "headline": "Final Challenge", "prompt": "How many UNIQUE customers placed orders? Use COUNT or COUNT DISTINCT?", "expected": "count distinct", "hint": "You want unique values, not total rows" },
    { "id": "10", "type": "summary", "headline": "Lesson Complete!", "bullets": ["Metrics need clear inclusion rules", "Grain = what one row represents", "COUNT DISTINCT for unique values"] }
  ]
}

Keep content professional. Don't over-personalize.`;

/* ═══════════════════════════════════════════════════════════
   JSON HELPERS
   ═══════════════════════════════════════════════════════════ */

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in response");
  return text.slice(start, end + 1);
}

function parseDeckJson(raw: string) {
  const text = (raw || "").trim();
  if (!text) throw new Error("Empty response");
  try { return JSON.parse(text); } catch { /* continue */ }
  try { return JSON.parse(extractJson(text)); } catch { /* continue */ }
  try { return JSON.parse(jsonrepair(text)); } catch { /* continue */ }
  try { return JSON.parse(jsonrepair(extractJson(text))); } catch { /* continue */ }
  throw new Error("JSON parse failed after all attempts");
}

/* ═══════════════════════════════════════════════════════════
   AUTH HELPERS
   ═══════════════════════════════════════════════════════════ */

async function getAuthHeaders() {
  const {
    GCP_PROJECT_NUMBER,
    GCP_SERVICE_ACCOUNT_EMAIL,
    GCP_WORKLOAD_IDENTITY_POOL_ID,
    GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID,
  } = process.env;

  if (
    GCP_PROJECT_NUMBER &&
    GCP_SERVICE_ACCOUNT_EMAIL &&
    GCP_WORKLOAD_IDENTITY_POOL_ID &&
    GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID
  ) {
    const maybeClient = ExternalAccountClient.fromJSON({
      type: "external_account",
      audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      token_url: "https://sts.googleapis.com/v1/token",
      service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
      subject_token_supplier: { getSubjectToken: getVercelOidcToken },
    });

    if (!maybeClient) throw new Error("ExternalAccountClient.fromJSON returned null");
    return await maybeClient.getRequestHeaders();
  }

  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
  return await (await auth.getClient()).getRequestHeaders();
}

function getAuth(h: Headers | Record<string, string>): string | null {
  if (!h) return null;
  if (h instanceof Headers) return h.get("authorization") ?? h.get("Authorization");
  return h.authorization || h.Authorization || null;
}

/* ═══════════════════════════════════════════════════════════
   DOCAI TEXT EXTRACTION
   ═══════════════════════════════════════════════════════════ */

async function extractText(params: { projectId: string; auth: string; base64: string }) {
  const url = `https://${DOCAI_LOCATION}-documentai.googleapis.com/v1/projects/${params.projectId}/locations/${DOCAI_LOCATION}/processors/${DOCAI_PROCESSOR_ID}:process`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { Authorization: params.auth, "Content-Type": "application/json" },
    body: JSON.stringify({ rawDocument: { content: params.base64, mimeType: "application/pdf" } }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`DocAI error ${resp.status}`);
  return (data?.document?.text || "").replace(/\s+/g, " ").trim().slice(0, 3000);
}

/* ═══════════════════════════════════════════════════════════
   GEMINI GENERATION
   ═══════════════════════════════════════════════════════════ */

async function generate(params: { projectId: string; auth: string; resume: string }) {
  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${params.projectId}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { Authorization: params.auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{ text: `Context: ${params.resume.slice(0, 1500)}\n\nGenerate the lesson.` }],
      }],
      systemInstruction: { role: "system", parts: [{ text: SYSTEM }] },
      generationConfig: { temperature: 0.2, maxOutputTokens: 2500, responseMimeType: "application/json" },
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Vertex API error ${resp.status}`);
  return parseDeckJson(data?.candidates?.[0]?.content?.parts?.[0]?.text || "");
}

/* ═══════════════════════════════════════════════════════════
   SAMPLE DATA — embedded into visuals
   ═══════════════════════════════════════════════════════════ */

const SAMPLE_ORDERS: OrderRow[] = [
  { id: 1, customer: "Alice", color: "#6366f1", item: "Latte", price: "$4.50" },
  { id: 2, customer: "Bob", color: "#f97316", item: "Cappuccino", price: "$5.00" },
  { id: 3, customer: "Alice", color: "#6366f1", item: "Croissant", price: "$3.25" },
  { id: 4, customer: "Carol", color: "#ec4899", item: "Espresso", price: "$3.00" },
  { id: 5, customer: "Bob", color: "#f97316", item: "Blueberry Scone", price: "$4.00" },
  { id: 6, customer: "Alice", color: "#6366f1", item: "Iced Tea", price: "$3.50" },
];

const SAMPLE_PEOPLE = [
  { name: "Alice", color: "#6366f1" },
  { name: "Bob", color: "#f97316" },
  { name: "Alice", color: "#6366f1" },
  { name: "Carol", color: "#ec4899" },
  { name: "Bob", color: "#f97316" },
  { name: "Alice", color: "#6366f1" },
];

/* ═══════════════════════════════════════════════════════════
   TRANSFORM: raw Gemini deck → page Lesson schema
   ═══════════════════════════════════════════════════════════

   The page's Zod schema expects a very specific shape per slide type.
   This function bridges the gap between the LLM's freeform output and
   the rigid typed structure the UI needs.
   ═══════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformToLesson(deck: any): Lesson {
  const rawSlides: any[] = Array.isArray(deck?.slides) ? deck.slides : [];
  if (rawSlides.length < 3) throw new Error("Too few slides from generation");

  const slides: Slide[] = rawSlides.map((raw, i) => {
    const id = String(raw?.id || i + 1);
    const rawType = String(raw?.type || "concept");
    const headline = String(raw?.headline || `Slide ${i + 1}`);
    const subheadline = raw?.subheadline ? String(raw.subheadline) : undefined;
    const bullets: string[] = Array.isArray(raw?.bullets) ? raw.bullets.map(String) : [];

    switch (rawType) {
      /* ── INTRO ── */
      case "intro": {
        const phases = bullets.length > 0
          ? [
            { content: "Analyzing your background…", delay: 1000 },
            { content: "Building your personalized lesson…", delay: 2500 },
            { content: bullets.map((b) => `**${b}**`).join("\n"), delay: 4000 },
          ]
          : undefined;
        return {
          id,
          type: "intro",
          title: headline,
          subtitle: subheadline,
          badge: "Lesson 1",
          badgeColor: "#6366f1",
          badgeIcon: "Database",
          phases,
        };
      }

      /* ── CONCEPT ── */
      case "concept": {
        // Convert bullets to a body paragraph with **bold** markers for KEY items
        const body = bullets
          .map((b) => {
            if (b.startsWith("KEY:")) return `**${b.replace("KEY: ", "")}**`;
            if (b.startsWith("⚠")) return `**${b}**`;
            return b;
          })
          .join("\n\n");
        // Determine badge from content
        const isGrain = headline.toLowerCase().includes("grain");
        const isMetric = headline.toLowerCase().includes("metric");
        return {
          id,
          type: "concept",
          title: headline,
          subtitle: subheadline,
          body: body || undefined,
          badge: isGrain ? "Core Concept" : isMetric ? "Foundation" : "Concept",
          badgeColor: isGrain ? "#f97316" : isMetric ? "#6366f1" : "#3b82f6",
          badgeIcon: isGrain ? "Eye" : isMetric ? "Lightbulb" : "Zap",
        };
      }

      /* ── INTERACTIVE → concept or checkpoint with embedded visual ── */
      case "interactive": {
        const visualType = raw?.visual?.type;

        if (visualType === "live_table") {
          return {
            id,
            type: "concept",
            title: headline,
            subtitle: subheadline ?? "Press play to watch orders arrive",
            badge: "Interactive",
            badgeColor: "#6366f1",
            badgeIcon: "Play",
            visual: {
              type: "live_table",
              orders: SAMPLE_ORDERS,
              revealSpeed: 600,
            },
          };
        }

        if (visualType === "count_demo") {
          return {
            id,
            type: "concept",
            title: headline,
            subtitle: subheadline ?? "Watch the count build up",
            body: "**COUNT(*)** counts every row. **COUNT(DISTINCT customer)** counts each person only once — duplicates are skipped.",
            badge: "Key Difference",
            badgeColor: "#10b981",
            badgeIcon: "Hash",
            visual: {
              type: "count_demo",
              people: SAMPLE_PEOPLE,
            },
          };
        }

        if (visualType === "sql_playground") {
          return {
            id,
            type: "checkpoint",
            title: headline,
            subtitle: subheadline,
            body: "Try both queries below to see the difference. Start with `COUNT(*)`, then try `COUNT(DISTINCT customer)`.",
            badge: "Hands-On",
            badgeColor: "#6366f1",
            badgeIcon: "Terminal",
            visual: {
              type: "sql_playground",
              orders: SAMPLE_ORDERS,
              defaultQuery: "SELECT COUNT(*) FROM orders;",
              hint: "After running COUNT(*), change it to COUNT(DISTINCT customer) and compare.",
            },
          };
        }

        if (visualType === "matching") {
          const rawPairs = Array.isArray(raw?.visual?.pairs) ? raw.visual.pairs : [];
          const pairs: MatchingPair[] = rawPairs.length > 0
            ? rawPairs.map((p: { left?: string; right?: string }) => ({
              left: String(p?.left || ""),
              right: String(p?.right || ""),
            }))
            : [
              { left: "COUNT(*)", right: "Counts all rows" },
              { left: "COUNT(DISTINCT)", right: "Counts unique values only" },
              { left: "Grain", right: "What one row represents" },
            ];
          return {
            id,
            type: "checkpoint",
            title: headline,
            body: "Match each SQL concept on the left with its definition on the right.",
            badge: "Practice",
            badgeColor: "#eab308",
            badgeIcon: "Zap",
            visual: {
              type: "matching",
              pairs,
              shuffleRight: true,
            },
          };
        }

        // Unknown visual → concept with body
        return {
          id,
          type: "concept",
          title: headline,
          subtitle: subheadline,
          body: bullets.join("\n\n") || undefined,
        };
      }

      /* ── QUIZ ── */
      case "quiz": {
        const rawOptions: string[] = Array.isArray(raw?.options) ? raw.options.map(String) : [];
        const expected = String(raw?.expected || "").toLowerCase();
        const prompt = raw?.prompt ? String(raw.prompt) : undefined;

        const options: QuizOption[] = rawOptions.map((opt) => ({
          label: opt,
          value: opt,
          correct: opt.toLowerCase() === expected,
        }));

        // Ensure at least one option is marked correct
        if (options.length > 0 && !options.some((o) => o.correct)) {
          options[0].correct = true;
        }

        return {
          id,
          type: "quiz",
          title: headline,
          subtitle: prompt,
          body: raw?.hint ? `💡 ${raw.hint}` : undefined,
          badge: "Quiz",
          badgeColor: "#6366f1",
          badgeIcon: "Lightbulb",
          options,
          successMessage: "That's right!",
          failureMessage: "Not quite — think about what one row represents.",
          remediation: "Each row in this table is a single order. The **grain** tells you what one row means. If each row = one order, then the grain is 'order'.",
        };
      }

      /* ── CHECKPOINT ── */
      case "checkpoint": {
        const prompt = raw?.prompt ? String(raw.prompt) : undefined;
        const hint = raw?.hint ? String(raw.hint) : undefined;

        // Convert to a quiz-style checkpoint with options
        return {
          id,
          type: "quiz",
          title: headline,
          subtitle: prompt,
          body: hint ? `💡 ${hint}` : undefined,
          badge: "Challenge",
          badgeColor: "#f97316",
          badgeIcon: "Award",
          options: [
            { label: "COUNT(*)", value: "count", correct: false },
            { label: "COUNT(DISTINCT customer)", value: "count distinct", correct: true },
          ],
          successMessage: "Exactly! DISTINCT removes duplicates.",
          failureMessage: "COUNT(*) counts all rows, including duplicates.",
          remediation: "**COUNT(*)** would give you the total number of orders. But the question asks for **unique customers** — you need **COUNT(DISTINCT customer)** to skip duplicates.",
          visual: {
            type: "count_demo",
            people: SAMPLE_PEOPLE,
          },
        };
      }

      /* ── SUMMARY ── */
      case "summary": {
        const iconMap: Record<number, string> = { 0: "Eye", 1: "Hash", 2: "Users", 3: "Check" };
        const checklist = bullets.map((b, bi) => ({
          icon: iconMap[bi] || "Check",
          text: b.replace(/^KEY:\s*/, ""),
        }));
        return {
          id,
          type: "summary",
          title: headline,
          body: "You've built a solid foundation in data analytics. These concepts are the building blocks for everything that follows.",
          checklist,
        };
      }

      /* ── FALLBACK ── */
      default:
        return {
          id,
          type: "concept" as const,
          title: headline,
          body: bullets.join("\n\n") || subheadline || undefined,
        };
    }
  });

  return {
    id: "lesson-1-data-foundations",
    title: String(deck?.title || "Lesson 1: Data Foundations"),
    description: "Master metrics, grain, and SQL counting",
    estimatedMinutes: 3,
    slides,
  };
}

/* ═══════════════════════════════════════════════════════════
   COMPLETE FALLBACK — directly in page Lesson schema
   ═══════════════════════════════════════════════════════════ */

function fallbackLesson(): Lesson {
  return {
    id: "lesson-1-data-foundations",
    title: "Lesson 1: Data Foundations",
    description: "Master metrics, grain, and SQL counting",
    estimatedMinutes: 3,
    slides: [
      {
        id: "1",
        type: "intro",
        title: "Welcome to Data Foundations",
        badge: "Lesson 1",
        badgeColor: "#6366f1",
        badgeIcon: "Database",
        phases: [
          { content: "Analyzing your background…", delay: 1000 },
          { content: "Building your personalized lesson…", delay: 2500 },
          { content: "**Define clear metrics**\n**Understand data structure**\n**Master SQL counting**", delay: 4000 },
        ],
      },
      {
        id: "2",
        type: "concept",
        title: "What is a Metric?",
        badge: "Foundation",
        badgeColor: "#6366f1",
        badgeIcon: "Lightbulb",
        body: "**A metric is a number that measures something specific in your business.**\n\nEvery metric needs inclusion rules: WHAT counts, WHEN it counts, WHERE it counts.\n\nExample: 'Monthly Active Users' = users who logged in at least once this month.\n\n**Without clear rules, different people will calculate different numbers!**",
      },
      {
        id: "3",
        type: "concept",
        title: "Watch Data Build Up",
        subtitle: "Press play to watch orders arrive",
        badge: "Interactive",
        badgeColor: "#6366f1",
        badgeIcon: "Play",
        visual: {
          type: "live_table",
          orders: SAMPLE_ORDERS,
          revealSpeed: 600,
        },
      },
      {
        id: "4",
        type: "concept",
        title: "Dataset Grain: The Foundation",
        badge: "Core Concept",
        badgeColor: "#f97316",
        badgeIcon: "Eye",
        body: "**Grain = what ONE ROW represents in your dataset.**\n\nIn an orders table: one row = one order.\nIn a customers table: one row = one customer.\n\nUnderstanding grain prevents double-counting mistakes.",
      },
      {
        id: "5",
        type: "quiz",
        title: "Quick Quiz",
        subtitle: "A table has 1,000 rows. Each row is one purchase transaction. What is the grain?",
        badge: "Quiz",
        badgeColor: "#6366f1",
        badgeIcon: "Lightbulb",
        options: [
          { label: "Customer", value: "Customer", correct: false },
          { label: "Product", value: "Product", correct: false },
          { label: "Transaction", value: "Transaction", correct: true },
          { label: "Store", value: "Store", correct: false },
        ],
        successMessage: "That's right!",
        failureMessage: "Not quite — think about what one row represents.",
        remediation: "Each row is a single purchase **transaction**. The grain tells you what one row means — if each row = one purchase, then the grain is 'transaction'.",
      },
      {
        id: "6",
        type: "concept",
        title: "COUNT vs COUNT DISTINCT",
        subtitle: "Watch the count build up",
        body: "**COUNT(*)** counts every row. **COUNT(DISTINCT customer)** counts each person only once — duplicates are skipped.",
        badge: "Key Difference",
        badgeColor: "#10b981",
        badgeIcon: "Hash",
        visual: {
          type: "count_demo",
          people: SAMPLE_PEOPLE,
        },
      },
      {
        id: "7",
        type: "checkpoint",
        title: "SQL Playground",
        body: "Try both queries below to see the difference. Start with `COUNT(*)`, then try `COUNT(DISTINCT customer)`.",
        badge: "Hands-On",
        badgeColor: "#6366f1",
        badgeIcon: "Terminal",
        visual: {
          type: "sql_playground",
          orders: SAMPLE_ORDERS,
          defaultQuery: "SELECT COUNT(*) FROM orders;",
          hint: "After running COUNT(*), change it to COUNT(DISTINCT customer) and compare.",
        },
      },
      {
        id: "8",
        type: "checkpoint",
        title: "Match the Concepts",
        body: "Match each SQL concept on the left with its definition on the right.",
        badge: "Practice",
        badgeColor: "#eab308",
        badgeIcon: "Zap",
        visual: {
          type: "matching",
          pairs: [
            { left: "COUNT(*)", right: "Counts all rows" },
            { left: "COUNT(DISTINCT)", right: "Counts unique values only" },
            { left: "Grain", right: "What one row represents" },
            { left: "Inclusion rules", right: "Define what counts in a metric" },
          ],
          shuffleRight: true,
        },
      },
      {
        id: "9",
        type: "quiz",
        title: "Final Challenge",
        subtitle: "You need to find how many DIFFERENT customers made purchases. Which should you use?",
        badge: "Challenge",
        badgeColor: "#f97316",
        badgeIcon: "Award",
        options: [
          { label: "COUNT(*)", value: "count", correct: false },
          { label: "COUNT(DISTINCT customer)", value: "count distinct", correct: true },
        ],
        successMessage: "Exactly! DISTINCT removes duplicates.",
        failureMessage: "COUNT(*) counts all rows, including duplicates.",
        remediation: "**COUNT(*)** gives you the total number of orders. But the question asks for **unique customers** — you need **COUNT(DISTINCT customer)** to skip duplicates.",
        visual: {
          type: "count_demo",
          people: SAMPLE_PEOPLE,
        },
      },
      {
        id: "10",
        type: "summary",
        title: "Lesson Complete!",
        body: "You've built a solid foundation in data analytics. These concepts are the building blocks for everything that follows.",
        checklist: [
          { icon: "Eye", text: "Metrics need clear inclusion rules (what, when, where)" },
          { icon: "Hash", text: "Grain tells you what one row represents" },
          { icon: "Users", text: "Use COUNT DISTINCT when you need unique values" },
          { icon: "Check", text: "Always check the grain before counting!" },
        ],
      },
    ],
  };
}

/* ═══════════════════════════════════════════════════════════
   POST HANDLER
   ═══════════════════════════════════════════════════════════ */

export async function POST(req: Request) {
  const start = Date.now();
  try {
    const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
    if (!projectId) return NextResponse.json({ error: "missing_project" }, { status: 500 });

    const hdrs = await getAuthHeaders();
    const auth = getAuth(hdrs);
    if (!auth) return NextResponse.json({ error: "missing_auth" }, { status: 500 });

    let resume = "";
    const ct = req.headers.get("content-type") || "";

    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      const text = form.get("resumeText");
      if (typeof text === "string" && text.trim().length > 0) {
        resume = text;
      } else {
        const file = form.get("resumeFile");
        if (!(file instanceof File))
          return NextResponse.json({ error: "no_file" }, { status: 400 });
        if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf"))
          return NextResponse.json({ error: "pdf_only" }, { status: 400 });
        const bytes = await file.arrayBuffer();
        resume = await extractText({ projectId, auth, base64: Buffer.from(bytes).toString("base64") });
      }
    } else {
      const body = await req.json().catch(() => ({}));
      resume = String(body?.resumeText || "");
    }

    if (resume.trim().length < 50) {
      return NextResponse.json({ error: "too_short", hint: "Upload PDF or paste more text" }, { status: 400 });
    }

    let lesson: Lesson;
    let usedFallback = false;

    try {
      const rawDeck = await generate({ projectId, auth, resume });
      lesson = transformToLesson(rawDeck);
      if (lesson.slides.length < 5) throw new Error("Too few slides after transform");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("Generation failed, using fallback:", msg);
      lesson = fallbackLesson();
      usedFallback = true;
    }

    console.log(`Lesson generated in ${Date.now() - start}ms, fallback=${usedFallback}`);
    return NextResponse.json(lesson);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Route error:", msg);
    return NextResponse.json({ error: "server_error", message: msg }, { status: 500 });
  }
}