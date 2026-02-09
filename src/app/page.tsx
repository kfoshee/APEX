import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#07070a", padding: "56px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            />
            <div style={{ color: "white", fontWeight: 900, letterSpacing: "-0.02em" }}>APEX</div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Nav href="/lesson1" label="Lesson 1" />
            <Nav href="/learn-more" label="Learn more" />
            <Nav href="/employers" label="Employers" />
            <Nav href="/apply" label="Apply" />
          </div>
        </div>

        {/* Hero */}
        <div style={{ marginTop: 42, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18 }}>
          <div
            style={{
              borderRadius: 26,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              padding: 28,
            }}
          >
            <div style={{ color: "#a1a1aa", fontSize: 13, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Portfolio-first, real work training
            </div>

            <div style={{ color: "white", fontSize: 44, fontWeight: 950, letterSpacing: "-0.04em", marginTop: 12, lineHeight: 1.05 }}>
              Learn by doing.
              <br />
              Prove skills with deliverables.
            </div>

            <div style={{ color: "#cbd5e1", fontSize: 16, marginTop: 14, lineHeight: 1.65, maxWidth: 740 }}>
              APEX trains analysts through real business problems. Start with <b>Lesson 1</b>: define a metric, check data grain, and write SQL that
              doesn’t embarrass you in a standup.
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <Primary href="/lesson1" label="Start Lesson 1" />
              <Secondary href="/learn-more" label="How it works" />
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Pill text="Interactive lessons" />
              <Pill text="Real datasets" />
              <Pill text="Portfolio outputs" />
              <Pill text="Employer challenges" />
            </div>
          </div>

          {/* Right card */}
          <div
            style={{
              borderRadius: 26,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)",
              padding: 22,
              display: "grid",
              gap: 12,
              alignContent: "start",
            }}
          >
            <div style={{ color: "white", fontWeight: 900, fontSize: 16 }}>Quick start</div>

            <CardLine title="Lesson 1" desc="Data Foundations (COUNT DISTINCT, grain, inclusion rules)" href="/lesson1" />
            <CardLine title="Apply" desc="Join the cohort / get updates" href="/apply" />
            <CardLine title="Employers" desc="Partner with APEX for challenges" href="/employers" />

            <div style={{ marginTop: 6, color: "#a1a1aa", fontSize: 12, lineHeight: 1.5 }}>
              If you’re debugging routes: homepage is <code>/</code>, lesson is <code>/lesson1</code>, API is <code>/api/lesson1</code>.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 36, color: "#71717a", fontSize: 12 }}>
          © {new Date().getFullYear()} APEX
        </div>
      </div>
    </main>
  );
}

function Nav({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.03)",
        color: "white",
        textDecoration: "none",
        fontWeight: 800,
        fontSize: 13,
      }}
    >
      {label}
    </Link>
  );
}

function Primary({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: "12px 16px",
        borderRadius: 999,
        background: "#ff6b6b",
        color: "white",
        textDecoration: "none",
        fontWeight: 950,
      }}
    >
      {label}
    </Link>
  );
}

function Secondary({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: "12px 16px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "white",
        textDecoration: "none",
        fontWeight: 900,
      }}
    >
      {label}
    </Link>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.03)",
        color: "#e5e7eb",
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {text}
    </div>
  );
}

function CardLine({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        textDecoration: "none",
        padding: 14,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ color: "white", fontWeight: 950, fontSize: 14 }}>{title}</div>
      <div style={{ color: "#a1a1aa", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
    </Link>
  );
}