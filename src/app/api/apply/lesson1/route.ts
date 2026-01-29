import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM = `
You are APEX SlideDeck Generator. Create a personalized animated slideshow for Lesson 1 of a data analytics course based on the student’s resume text.

Hard requirements:
- Output ONLY valid JSON. No markdown, no commentary, no code fences.
- Use double quotes for all JSON keys and strings.
- Do not include private details from the resume; only use broad themes (e.g., ecommerce, sports, volunteering, research).
- Lesson 1 must teach:
  1) defining a metric with inclusion rules
  2) dataset grain (what one row represents)
  3) COUNT vs COUNT DISTINCT
- The deck must be 6–10 slides total.
- It must include exactly 2 checkpoint slides.
- It must include exactly 1 example slide with SQL code that uses COUNT and COUNT DISTINCT.
- Code/table/field names must match the scenario theme (no unrelated terms like "donors" in social media).
- Headline max 10 words.
- Bullets max 3 items. Each bullet max 10 words.
- Use short uppercase labels occasionally as the first bullet (e.g., "KEY IDEA", "EXAMPLE", "QUICK CHECK").

Slide ordering requirement:
- Slide 1–3: concept (metric, inclusion rules, grain)
- Slide 4: checkpoint (grain)
- Slide 5: concept (COUNT vs COUNT DISTINCT)
- Slide 6: example (SQL)
- Slide 7: checkpoint (COUNT DISTINCT)
- Slide 8+: summary (takeaways)

Return JSON matching this schema:
{
  "theme": "string",
  "title": "string",
  "slides": [
    {
      "id": "string",
      "type": "concept" | "example" | "checkpoint" | "summary",
      "headline": "string",
      "bullets": ["string"],
      "code": "string",
      "prompt": "string",
      "expected": "string"
    }
  ]
}

Rules for fields:
- For type "concept" and "summary": include headline and bullets; set code/prompt/expected to "".
- For type "example": include headline and code; bullets optional; set prompt/expected to "".
- For type "checkpoint": include headline, prompt, expected; code ""; bullets optional.

If you cannot comply, output: {"error":"invalid_request"}
`.trim();

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model returned no JSON");
  }
  return JSON.parse(text.slice(start, end + 1));
}

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "resumeText_required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_GEMINI_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: SYSTEM,
    });

    const prompt = `Resume text:\n${resumeText}\n\nReturn ONLY JSON. Begin with { and end with }.`;
    const result = await model.generateContent(prompt);

    const raw = result.response.text().trim();
    const deck = extractJson(raw);

    return NextResponse.json(deck);
  } catch (err: any) {
    return NextResponse.json(
      { error: "server_error", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}