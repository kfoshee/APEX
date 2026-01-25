import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

function getString(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

async function fileToAttachment(file: File) {
  const buf = Buffer.from(await file.arrayBuffer());
  return {
    filename: file.name || "upload",
    content: buf,
  };
}

export async function POST(req: Request) {
  try {
    // --- env vars ---
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.APPLY_TO_EMAIL;
    const from = process.env.APPLY_FROM_EMAIL;

    if (!apiKey) return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
    if (!to) return NextResponse.json({ error: "Missing APPLY_TO_EMAIL" }, { status: 500 });
    if (!from) return NextResponse.json({ error: "Missing APPLY_FROM_EMAIL" }, { status: 500 });

    // --- parse form ---
    const form = await req.formData();

    // text fields (match your frontend keys exactly)
    const name = getString(form, "name");
    const email = getString(form, "email");
    const phone = getString(form, "phone");
    const track = getString(form, "track");
    const currentStatus = getString(form, "currentStatus");
    const school = getString(form, "school");
    const linkedin = getString(form, "linkedin");
    const portfolio = getString(form, "portfolio");
    const hearAbout = getString(form, "hearAbout");
    const why = getString(form, "why");
    const goals = getString(form, "goals");

    // required (your UI enforces these, but server should too)
    if (!name || !email || !why) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, why)." },
        { status: 400 }
      );
    }

    // files
    const resume = form.get("resume");
    const satScore = form.get("satScore");

    const attachments: { filename: string; content: Buffer }[] = [];

    if (resume instanceof File) {
      attachments.push(await fileToAttachment(resume));
    } else {
      // resume is required in your step 2
      return NextResponse.json({ error: "Resume is required." }, { status: 400 });
    }

    if (satScore instanceof File) {
      attachments.push(await fileToAttachment(satScore));
    }

    // email body
    const subject = `New APEX Application — ${name}${track ? ` (${track})` : ""}`;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      track ? `Track: ${track}` : null,
      currentStatus ? `Current status: ${currentStatus}` : null,
      school ? `School: ${school}` : null,
      linkedin ? `LinkedIn: ${linkedin}` : null,
      portfolio ? `Portfolio: ${portfolio}` : null,
      hearAbout ? `Heard about APEX: ${hearAbout}` : null,
      "",
      "Why APEX:",
      why,
      "",
      goals ? "5-year goals:" : null,
      goals ? goals : null,
    ]
      .filter(Boolean)
      .join("\n");

    // send
    await resend.emails.send({
      from,
      to,
      replyTo: email, // so you can hit Reply and respond to applicant
      subject,
      text,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("APPLY API ERROR:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}