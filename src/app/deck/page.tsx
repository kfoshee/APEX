export const metadata = {
  title: "APEX Pitch Deck",
  description: "APEX pitch deck",
};

export default function DeckPage() {
  const pdfPath = "/apex-deck.pdf";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              APEX
            </div>
            <h1 style={{ marginTop: 8, marginBottom: 6, fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em" }}>
              Pitch Deck
            </h1>
            <p style={{ margin: 0, color: "#a1a1aa", lineHeight: 1.6 }}>
              View in browser or download the PDF.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={pdfPath}
              download
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 16px",
                borderRadius: 999,
                background: "#ff6b6b",
                color: "white",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Download PDF
            </a>

            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 16px",
                borderRadius: 999,
                border: "1px solid #27272a",
                background: "transparent",
                color: "white",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back to apex.degree
            </a>

            {/* Optional: add a demo link if you have one */}
            {/* <a href="/demo" style={{ ...sameStyle }}>Watch Demo</a> */}
          </div>
        </div>

        <div
          style={{
            marginTop: 22,
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid #27272a",
            background: "#111113",
            boxShadow: "0 30px 80px -30px rgba(0,0,0,0.8)",
          }}
        >
          {/* PDF Embed */}
          <iframe
            src={`${pdfPath}#view=FitH`}
            title="APEX Pitch Deck"
            style={{ width: "100%", height: "80vh", border: 0 }}
          />
        </div>

        <div style={{ marginTop: 16, color: "#71717a", fontSize: 13, lineHeight: 1.6 }}>
          If the embed doesn’t load on mobile,{" "}
          <a href={pdfPath} style={{ color: "#ff6b6b", fontWeight: 600 }}>
            open the PDF directly
          </a>
          .
        </div>
      </div>
    </main>
  );
}