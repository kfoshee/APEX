export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ExternalAccountClient, GoogleAuth } from "google-auth-library";
import { getVercelOidcToken } from "@vercel/oidc";
import { jsonrepair } from "jsonrepair";

const LOCATION = process.env.GCP_LOCATION || "us-central1";
const MODEL = process.env.VERTEX_MODEL || "gemini-2.5-flash";
const DOCAI_LOCATION = process.env.DOCAI_LOCATION || "us";
const DOCAI_PROCESSOR_ID = process.env.DOCAI_PROCESSOR_ID || "776c52b2d795c6e3";

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
    { "id": "7", "type": "interactive", "headline": "Try It Yourself", "subheadline": "Edit and run this SQL query", "visual": { "type": "sql_playground", "code": "SELECT\\n  COUNT(*) as total_orders,\\n  COUNT(DISTINCT customer_id) as unique_customers\\nFROM orders;", "result": [["total_orders", "unique_customers"], ["5", "3"]] } },
    { "id": "8", "type": "interactive", "headline": "Match the Concepts", "visual": { "type": "matching", "pairs": [{ "left": "COUNT(*)", "right": "Counts all rows" }, { "left": "COUNT DISTINCT", "right": "Counts unique values" }, { "left": "Grain", "right": "What one row represents" }] } },
    { "id": "9", "type": "checkpoint", "headline": "Final Challenge", "prompt": "How many UNIQUE customers placed orders? Use COUNT or COUNT DISTINCT?", "expected": "count distinct", "hint": "You want unique values, not total rows" },
    { "id": "10", "type": "summary", "headline": "Lesson Complete!", "bullets": ["Metrics need clear inclusion rules", "Grain = what one row represents", "COUNT DISTINCT for unique values"] }
  ]
}

Keep content professional. Don't over-personalize.`;

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON");
  return text.slice(start, end + 1);
}

function parseDeckJson(raw: string) {
  const text = (raw || "").trim();
  if (!text) throw new Error("Empty");
  try { return JSON.parse(text); } catch {}
  try { return JSON.parse(extractJson(text)); } catch {}
  try { return JSON.parse(jsonrepair(text)); } catch {}
  try { return JSON.parse(jsonrepair(extractJson(text))); } catch {}
  throw new Error("JSON parse failed");
}

async function getAuthHeaders() {
  const { GCP_PROJECT_NUMBER, GCP_SERVICE_ACCOUNT_EMAIL, GCP_WORKLOAD_IDENTITY_POOL_ID, GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID } = process.env;
  if (GCP_PROJECT_NUMBER && GCP_SERVICE_ACCOUNT_EMAIL && GCP_WORKLOAD_IDENTITY_POOL_ID && GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID) {
    const client = ExternalAccountClient.fromJSON({
      type: "external_account",
      audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      token_url: "https://sts.googleapis.com/v1/token",
      service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
      subject_token_supplier: { getSubjectToken: getVercelOidcToken },
    });
    return await client.getRequestHeaders();
  }
  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
  return await (await auth.getClient()).getRequestHeaders();
}

function getAuth(h: any): string | null {
  if (!h) return null;
  if (typeof h.get === "function") return h.get("authorization") || h.get("Authorization");
  return h.authorization || h.Authorization || null;
}

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

function normalize(deck: any) {
  return {
    theme: String(deck?.theme || "Data Foundations"),
    title: String(deck?.title || "Lesson 1"),
    slides: (Array.isArray(deck?.slides) ? deck.slides : []).map((s: any, i: number) => ({
      id: String(s?.id || i + 1),
      type: s?.type || "concept",
      headline: String(s?.headline || `Slide ${i + 1}`),
      subheadline: s?.subheadline || "",
      bullets: Array.isArray(s?.bullets) ? s.bullets.map(String) : [],
      code: String(s?.code || "").replace(/\\n/g, "\n"),
      prompt: s?.prompt || "",
      expected: s?.expected || "",
      hint: s?.hint || "",
      options: Array.isArray(s?.options) ? s.options : [],
      visual: s?.visual || undefined,
    })),
  };
}

async function generate(params: { projectId: string; auth: string; resume: string }) {
  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${params.projectId}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { Authorization: params.auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `Context: ${params.resume.slice(0, 1500)}\n\nGenerate the lesson.` }] }],
      systemInstruction: { role: "system", parts: [{ text: SYSTEM }] },
      generationConfig: { temperature: 0.2, maxOutputTokens: 2500, responseMimeType: "application/json" },
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  return parseDeckJson(data?.candidates?.[0]?.content?.parts?.[0]?.text || "");
}

// Rich fallback with all interactive types
function fallback() {
  return {
    theme: "Data Foundations",
    title: "Lesson 1: Data Foundations",
    slides: [
      {
        id: "1",
        type: "intro",
        headline: "Welcome to Data Foundations",
        subheadline: "Master the essential concepts every data analyst needs to know",
        bullets: ["Define clear metrics", "Understand data structure", "Master SQL counting"],
      },
      {
        id: "2",
        type: "concept",
        headline: "What is a Metric?",
        bullets: [
          "KEY: A metric is a number that measures something specific in your business",
          "Every metric needs inclusion rules: WHAT counts, WHEN it counts, WHERE it counts",
          "Example: 'Monthly Active Users' = users who logged in at least once this month",
          "⚠ Without clear rules, different people will calculate different numbers!"
        ],
      },
      {
        id: "3",
        type: "interactive",
        headline: "Watch Data Build Up",
        subheadline: "See how orders accumulate in a real database table",
        visual: { type: "live_table" },
      },
      {
        id: "4",
        type: "concept",
        headline: "Dataset Grain: The Foundation",
        bullets: [
          "KEY: Grain = what ONE ROW represents in your dataset",
          "In an orders table: one row = one order",
          "In a customers table: one row = one customer",
          "Understanding grain prevents double-counting mistakes"
        ],
      },
      {
        id: "5",
        type: "quiz",
        headline: "Quick Quiz",
        prompt: "A table has 1,000 rows. Each row represents one purchase transaction. What is the grain?",
        options: ["Customer", "Product", "Transaction", "Store"],
        expected: "Transaction",
      },
      {
        id: "6",
        type: "interactive",
        headline: "COUNT vs COUNT DISTINCT",
        subheadline: "Click the buttons to see each function in action!",
        visual: { type: "count_demo" },
      },
      {
        id: "7",
        type: "interactive",
        headline: "SQL Playground",
        subheadline: "Edit and run this query to see the results",
        visual: {
          type: "sql_playground",
          code: "SELECT\n  COUNT(*) as total_orders,\n  COUNT(DISTINCT customer_id) as unique_customers\nFROM orders\nWHERE order_date >= '2024-01-01';",
          result: [["total_orders", "unique_customers"], ["1,247", "523"]],
        },
      },
      {
        id: "8",
        type: "interactive",
        headline: "Match the Concepts",
        visual: {
          type: "matching",
          pairs: [
            { left: "COUNT(*)", right: "Counts all rows" },
            { left: "COUNT DISTINCT", right: "Counts unique values only" },
            { left: "Grain", right: "What one row represents" },
            { left: "Inclusion rules", right: "Define what counts in a metric" },
          ],
        },
      },
      {
        id: "9",
        type: "checkpoint",
        headline: "Final Challenge",
        prompt: "You need to find how many DIFFERENT customers made purchases this month. Should you use COUNT(*) or COUNT(DISTINCT customer_id)?",
        expected: "count distinct",
        hint: "You want UNIQUE customers, not total rows. Which function removes duplicates?",
      },
      {
        id: "10",
        type: "summary",
        headline: "Lesson Complete!",
        bullets: [
          "Metrics need clear inclusion rules (what, when, where)",
          "Grain tells you what one row represents",
          "Use COUNT DISTINCT when you need unique values",
          "Always check the grain before counting!"
        ],
      }
    ],
  };
}

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
        if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });
        if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
          return NextResponse.json({ error: "pdf_only" }, { status: 400 });
        }
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

    let deck;
    let usedFallback = false;

    try {
      deck = await generate({ projectId, auth, resume });
      deck = normalize(deck);
      if (deck.slides.length < 5) throw new Error("Too few slides");
    } catch (e: any) {
      console.error("Gen failed:", e.message);
      deck = fallback();
      usedFallback = true;
    }

    console.log(`Done in ${Date.now() - start}ms, fallback=${usedFallback}`);
    return NextResponse.json({ ...deck, _meta: { time: Date.now() - start, fallback: usedFallback } });

  } catch (e: any) {
    console.error("Error:", e);
    return NextResponse.json({ error: "server_error", message: e?.message }, { status: 500 });
  }
}