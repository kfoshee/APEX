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

const SYSTEM = `You are creating an interactive data analytics lesson for APEX, a platform that trains analysts through real business problems. Return ONLY valid JSON.

SCENARIO: The learner is a junior analyst at "NovaCast," a podcast streaming subscription service. Their manager just asked: "How many paying subscribers did we have last month?" The lesson teaches them to answer that question correctly — defining the metric with explicit inclusion rules, understanding the data grain so they don't double-count, and writing the SQL.

LESSON OUTCOME: Earn the "Data Foundations" badge and unlock Lesson 2 (Aggregation & Grouping).

Create exactly this structure with 10 slides:
{
  "theme": "Data Foundations",
  "title": "Lesson 1: Data Foundations",
  "slides": [
    { "id": "1", "type": "intro", "headline": "Your First Analyst Task", "subheadline": "Your manager needs last month's paying subscriber count by end of day", "bullets": ["Define a metric with inclusion rules", "Read the data grain so you don't double-count", "Write the SQL to get the right number"] },
    { "id": "2", "type": "concept", "headline": "Metrics Need Rules", "bullets": ["KEY: A metric without rules is just a guess", "WHO counts: only users on a paid plan (exclude free-trial and churned)", "WHEN: subscription active at any point during last calendar month", "WHERE: all regions, but exclude internal test accounts", "⚠ Without these rules, your subscriber count could be off by thousands"] },
    { "id": "3", "type": "interactive", "headline": "The Subscriptions Table", "subheadline": "Hit play — watch real subscription events stream in", "visual": { "type": "live_table" } },
    { "id": "4", "type": "concept", "headline": "Grain: Why One Row Matters", "bullets": ["KEY: Grain = what one row represents", "The subscriptions table has one row per billing event, NOT one row per customer", "Alice has 3 rows because she was billed 3 times — if you COUNT(*) you get 6 total rows, not 3 customers", "⚠ Wrong grain assumption = double-counted subscribers in your report"] },
    { "id": "5", "type": "quiz", "headline": "Spot the Grain", "prompt": "NovaCast's subscriptions table has one row per monthly billing event. A customer billed 3 months has 3 rows. What is the grain?", "options": ["Customer", "Subscription plan", "Billing event", "Calendar month"], "expected": "Billing event", "hint": "Each row is one billing event — not one customer" },
    { "id": "6", "type": "interactive", "headline": "COUNT(*) vs COUNT(DISTINCT)", "subheadline": "See why the wrong COUNT inflates your number", "visual": { "type": "count_demo" } },
    { "id": "7", "type": "interactive", "headline": "Write the Query", "subheadline": "Get NovaCast's unique subscriber count", "visual": { "type": "sql_playground" } },
    { "id": "8", "type": "interactive", "headline": "Lock In the Concepts", "visual": { "type": "matching", "pairs": [{ "left": "COUNT(*)", "right": "Total billing events (includes duplicates)" }, { "left": "COUNT(DISTINCT customer)", "right": "Unique paying subscribers" }, { "left": "Grain", "right": "What one row in the table represents" }, { "left": "Inclusion rules", "right": "WHO / WHEN / WHERE / exclusions" }] } },
    { "id": "9", "type": "checkpoint", "headline": "The Manager Question", "prompt": "Your manager asks: how many UNIQUE paying subscribers did we have last month? Which query do you send?", "expected": "count distinct", "hint": "You need unique people, not total billing rows" },
    { "id": "10", "type": "summary", "headline": "Badge Earned: Data Foundations", "bullets": ["Every metric needs inclusion rules — WHO, WHEN, WHERE, and what to exclude", "Check the grain before you count — one row does not equal one customer", "COUNT(DISTINCT) for unique values, COUNT(*) for total rows", "Next up: Lesson 2 — Aggregation & Grouping"] }
  ]
}

Keep the tone direct and professional. Ground every concept in the NovaCast scenario. Don't use filler phrases or generic motivation.`;

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
   SAMPLE DATA — NovaCast subscription billing events
   ═══════════════════════════════════════════════════════════ */

const SAMPLE_ORDERS: OrderRow[] = [
  { id: 1, customer: "Alice", color: "#6366f1", item: "Pro Monthly", price: "$14.99" },
  { id: 2, customer: "Bob", color: "#f97316", item: "Pro Monthly", price: "$14.99" },
  { id: 3, customer: "Alice", color: "#6366f1", item: "Pro Monthly", price: "$14.99" },
  { id: 4, customer: "Carol", color: "#ec4899", item: "Team Monthly", price: "$29.99" },
  { id: 5, customer: "Bob", color: "#f97316", item: "Pro Monthly", price: "$14.99" },
  { id: 6, customer: "Alice", color: "#6366f1", item: "Pro Monthly", price: "$14.99" },
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
   ═══════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformToLesson(deck: any): Lesson {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawSlides: any[] = Array.isArray(deck?.slides) ? deck.slides : [];
  if (rawSlides.length < 3) throw new Error("Too few slides from generation");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slides: Slide[] = rawSlides.map((raw: any, i: number) => {
    const id = String(raw?.id || i + 1);
    const rawType = String(raw?.type || "concept");
    const headline = String(raw?.headline || `Slide ${i + 1}`);
    const subheadline = raw?.subheadline ? String(raw.subheadline) : undefined;
    const bullets: string[] = Array.isArray(raw?.bullets) ? raw.bullets.map(String) : [];

    switch (rawType) {
      case "intro": {
        const phases = bullets.length > 0
          ? [
            { content: "Scanning your background…", delay: 1000 },
            { content: "Building your scenario…", delay: 2500 },
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

      case "concept": {
        const body = bullets
          .map((b) => {
            if (b.startsWith("KEY:")) return `**${b.replace("KEY: ", "")}**`;
            if (b.startsWith("⚠")) return `**${b}**`;
            return b;
          })
          .join("\n\n");
        const isGrain = headline.toLowerCase().includes("grain");
        const isMetric = headline.toLowerCase().includes("metric") || headline.toLowerCase().includes("rule");
        return {
          id,
          type: "concept",
          title: headline,
          subtitle: subheadline,
          body: body || undefined,
          badge: isGrain ? "Core Concept" : isMetric ? "The Job" : "Concept",
          badgeColor: isGrain ? "#f97316" : isMetric ? "#6366f1" : "#3b82f6",
          badgeIcon: isGrain ? "Eye" : isMetric ? "Lightbulb" : "Zap",
        };
      }

      case "interactive": {
        const visualType = raw?.visual?.type;

        if (visualType === "live_table") {
          return {
            id,
            type: "concept",
            title: headline,
            subtitle: subheadline ?? "Hit play — watch subscription events stream in",
            badge: "Live Data",
            badgeColor: "#6366f1",
            badgeIcon: "Play",
            visual: { type: "live_table", orders: SAMPLE_ORDERS, revealSpeed: 600 },
          };
        }

        if (visualType === "count_demo") {
          return {
            id,
            type: "concept",
            title: headline,
            subtitle: subheadline ?? "See why the wrong COUNT inflates your number",
            body: "**COUNT(*)** counts every billing row — Alice appears 3 times, so you'd report 6 instead of 3 subscribers. **COUNT(DISTINCT customer)** counts each person once.",
            badge: "Key Difference",
            badgeColor: "#10b981",
            badgeIcon: "Hash",
            visual: { type: "count_demo", people: SAMPLE_PEOPLE },
          };
        }

        if (visualType === "sql_playground") {
          return {
            id,
            type: "checkpoint",
            title: headline,
            subtitle: subheadline,
            body: "Run `COUNT(*)` first. Then change it to `COUNT(DISTINCT customer)` and compare. The gap between those two numbers is how many subscribers you'd overcount.",
            badge: "Your Turn",
            badgeColor: "#6366f1",
            badgeIcon: "Terminal",
            visual: {
              type: "sql_playground",
              orders: SAMPLE_ORDERS,
              defaultQuery: "SELECT COUNT(*) FROM subscriptions;",
              hint: "Run COUNT(*) first, then switch to COUNT(DISTINCT customer). Notice the difference.",
            },
          };
        }

        if (visualType === "matching") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawPairs = Array.isArray(raw?.visual?.pairs) ? raw.visual.pairs : [];
          const pairs: MatchingPair[] = rawPairs.length > 0
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? rawPairs.map((p: any) => ({
              left: String(p?.left || ""),
              right: String(p?.right || ""),
            }))
            : [
              { left: "COUNT(*)", right: "Total billing events (includes duplicates)" },
              { left: "COUNT(DISTINCT customer)", right: "Unique paying subscribers" },
              { left: "Grain", right: "What one row in the table represents" },
              { left: "Inclusion rules", right: "WHO / WHEN / WHERE / exclusions" },
            ];
          return {
            id,
            type: "checkpoint",
            title: headline,
            body: "Match each term to its definition. These are words you'll use in every analyst standup.",
            badge: "Skill Check",
            badgeColor: "#eab308",
            badgeIcon: "Zap",
            visual: { type: "matching", pairs, shuffleRight: true },
          };
        }

        return {
          id,
          type: "concept",
          title: headline,
          subtitle: subheadline,
          body: bullets.join("\n\n") || undefined,
        };
      }

      case "quiz": {
        const rawOptions: string[] = Array.isArray(raw?.options) ? raw.options.map(String) : [];
        const expected = String(raw?.expected || "").toLowerCase();
        const prompt = raw?.prompt ? String(raw.prompt) : undefined;

        const options: QuizOption[] = rawOptions.map((opt) => ({
          label: opt,
          value: opt,
          correct: opt.toLowerCase() === expected,
        }));

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
          successMessage: "Correct — you'd get this right on the job.",
          failureMessage: "Not quite. On the job, this mistake means your report counts rows instead of people.",
          remediation: "The grain is **billing event** — each row is one charge, not one customer. Alice was billed 3 times, so she has 3 rows. If you assumed the grain was 'customer,' you'd think COUNT(*) gives you subscriber count. It doesn't — it gives you total billing events. This mistake inflates your report by double-counting repeat customers.",
        };
      }

      case "checkpoint": {
        const prompt = raw?.prompt ? String(raw.prompt) : undefined;
        const hint = raw?.hint ? String(raw.hint) : undefined;

        return {
          id,
          type: "quiz",
          title: headline,
          subtitle: prompt,
          body: hint ? `💡 ${hint}` : undefined,
          badge: "Manager Check",
          badgeColor: "#f97316",
          badgeIcon: "Award",
          options: [
            { label: "SELECT COUNT(*) FROM subscriptions", value: "count", correct: false },
            { label: "SELECT COUNT(DISTINCT customer) FROM subscriptions", value: "count distinct", correct: true },
          ],
          successMessage: "That's the query your manager needs. You'd nail this in a real standup.",
          failureMessage: "COUNT(*) gives 6 billing rows — but NovaCast only has 3 subscribers. Your manager would catch this.",
          remediation: "**COUNT(*)** returns 6 because the table has 6 billing events. But your manager asked for **unique subscribers** — that's 3 people. **COUNT(DISTINCT customer)** removes the duplicate rows for Alice and Bob, giving you the correct answer. In a real job, sending the wrong number means your manager loses trust in your analysis.",
          visual: { type: "count_demo", people: SAMPLE_PEOPLE },
        };
      }

      case "summary": {
        const iconMap: Record<number, string> = { 0: "Eye", 1: "Hash", 2: "Users", 3: "ArrowRight" };
        const checklist = bullets.map((b, bi) => ({
          icon: iconMap[bi] || "Check",
          text: b.replace(/^KEY:\s*/, ""),
        }));
        return {
          id,
          type: "summary",
          title: headline,
          body: "You can now define a metric, check the grain, and write the right COUNT query. That's the foundation for every analysis you'll build at a real company.",
          checklist,
        };
      }

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
    description: "Define metrics, check the grain, write the right COUNT",
    estimatedMinutes: 4,
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
    description: "Define metrics, check the grain, write the right COUNT",
    estimatedMinutes: 4,
    slides: [
      {
        id: "1",
        type: "intro",
        title: "Your First Analyst Task",
        subtitle: "Your manager needs last month's paying subscriber count by end of day",
        badge: "Lesson 1",
        badgeColor: "#6366f1",
        badgeIcon: "Database",
        phases: [
          { content: "Scanning your background…", delay: 1000 },
          { content: "Building your scenario…", delay: 2500 },
          { content: "**Define a metric with inclusion rules**\n**Read the grain so you don't double-count**\n**Write the SQL to get the right number**", delay: 4000 },
        ],
      },
      {
        id: "2",
        type: "concept",
        title: "Metrics Need Rules",
        badge: "The Job",
        badgeColor: "#6366f1",
        badgeIcon: "Lightbulb",
        body: "**A metric without rules is just a guess.** Your manager asks for \u201cpaying subscribers last month.\u201d Before you write any SQL, you need to define exactly what counts.\n\n**WHO:** Users on a paid plan \u2014 exclude free-trial and churned accounts\n**WHEN:** Subscription active at any point during the last calendar month\n**WHERE:** All regions, but exclude internal test accounts (@novacast.dev emails)\n\n**Without these rules, two analysts will get two different numbers for the same question.**",
      },
      {
        id: "3",
        type: "concept",
        title: "The Subscriptions Table",
        subtitle: "Hit play \u2014 watch subscription billing events stream in",
        badge: "Live Data",
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
        title: "Grain: Why One Row Matters",
        badge: "Core Concept",
        badgeColor: "#f97316",
        badgeIcon: "Eye",
        body: "**Grain = what one row represents in your table.**\n\nThis subscriptions table has one row per **billing event**, not one row per customer. Alice has 3 rows because she was billed 3 months. Bob has 2 rows.\n\nIf you assume each row is a customer and run COUNT(*), you'd report 6 subscribers. The real answer is 3.\n\n**\u26a0 Wrong grain assumption \u2192 double-counted subscribers \u2192 bad report \u2192 awkward conversation with your manager.**",
      },
      {
        id: "5",
        type: "quiz",
        title: "Spot the Grain",
        subtitle: "NovaCast's subscriptions table has one row per monthly billing event. A customer billed 3 months in a row has 3 rows. What is the grain?",
        badge: "Quiz",
        badgeColor: "#6366f1",
        badgeIcon: "Lightbulb",
        body: "\ud83d\udca1 What does a single row represent?",
        options: [
          { label: "Customer", value: "Customer", correct: false },
          { label: "Subscription plan", value: "Subscription plan", correct: false },
          { label: "Billing event", value: "Billing event", correct: true },
          { label: "Calendar month", value: "Calendar month", correct: false },
        ],
        successMessage: "Correct \u2014 you'd get this right on the job.",
        failureMessage: "Not quite. On the job, confusing this means your COUNT returns the wrong number.",
        remediation: "The grain is **billing event** \u2014 each row is one charge, not one customer. Alice was billed 3 times, so she has 3 rows. If you assumed the grain was \u2018customer,\u2019 you'd think COUNT(*) gives you subscriber count. It doesn't \u2014 it gives you total billing events. This mistake inflates your report by double-counting repeat customers.",
      },
      {
        id: "6",
        type: "concept",
        title: "COUNT(*) vs COUNT(DISTINCT)",
        subtitle: "See why the wrong COUNT inflates your number",
        body: "**COUNT(*)** counts every billing row \u2014 Alice appears 3 times, so you'd report 6 instead of 3 subscribers. **COUNT(DISTINCT customer)** counts each person once. The gap between these numbers is exactly how much you'd overcount.",
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
        title: "Write the Query",
        body: "Run `COUNT(*)` first. Then change it to `COUNT(DISTINCT customer)` and compare. The gap between those two numbers is how many subscribers you'd overcount.",
        badge: "Your Turn",
        badgeColor: "#6366f1",
        badgeIcon: "Terminal",
        visual: {
          type: "sql_playground",
          orders: SAMPLE_ORDERS,
          defaultQuery: "SELECT COUNT(*) FROM subscriptions;",
          hint: "Run COUNT(*) first, then switch to COUNT(DISTINCT customer). Notice the difference.",
        },
      },
      {
        id: "8",
        type: "checkpoint",
        title: "Lock In the Concepts",
        body: "Match each term to its definition. These are words you'll use in every analyst standup.",
        badge: "Skill Check",
        badgeColor: "#eab308",
        badgeIcon: "Zap",
        visual: {
          type: "matching",
          pairs: [
            { left: "COUNT(*)", right: "Total billing events (includes duplicates)" },
            { left: "COUNT(DISTINCT customer)", right: "Unique paying subscribers" },
            { left: "Grain", right: "What one row in the table represents" },
            { left: "Inclusion rules", right: "WHO / WHEN / WHERE / exclusions" },
          ],
          shuffleRight: true,
        },
      },
      {
        id: "9",
        type: "quiz",
        title: "The Manager Question",
        subtitle: "Your manager asks: \u2018How many unique paying subscribers did we have last month?\u2019 Which query do you send?",
        badge: "Manager Check",
        badgeColor: "#f97316",
        badgeIcon: "Award",
        options: [
          { label: "SELECT COUNT(*) FROM subscriptions", value: "count", correct: false },
          { label: "SELECT COUNT(DISTINCT customer) FROM subscriptions", value: "count distinct", correct: true },
        ],
        successMessage: "That's the query your manager needs. You'd nail this in a real standup.",
        failureMessage: "COUNT(*) gives 6 billing rows \u2014 but NovaCast only has 3 subscribers. Your manager would catch this.",
        remediation: "**COUNT(*)** returns 6 because the table has 6 billing events. But your manager asked for **unique subscribers** \u2014 that's 3 people. **COUNT(DISTINCT customer)** removes the duplicate rows for Alice and Bob, giving you the correct answer. In a real job, sending the wrong number means your manager loses trust in your analysis.",
        visual: {
          type: "count_demo",
          people: SAMPLE_PEOPLE,
        },
      },
      {
        id: "10",
        type: "summary",
        title: "Badge Earned: Data Foundations",
        body: "You can now define a metric, check the grain, and write the right COUNT query. That's the foundation for every analysis you'll build at a real company.",
        checklist: [
          { icon: "Eye", text: "Every metric needs inclusion rules \u2014 WHO, WHEN, WHERE, and what to exclude" },
          { icon: "Hash", text: "Check the grain before you count \u2014 one row \u2260 one customer" },
          { icon: "Users", text: "COUNT(DISTINCT) for unique values, COUNT(*) for total rows" },
          { icon: "ArrowRight", text: "Next up: Lesson 2 \u2014 Aggregation & Grouping" },
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