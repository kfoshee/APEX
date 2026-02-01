"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowLeft, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const smooth: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

export default function DeckPage() {
  const pdfPath = "/apex-deck.pdf";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        * { 
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        html, body { 
          overflow-x: hidden !important; 
          width: 100% !important;
          max-width: 100% !important;
          margin: 0; 
          padding: 0; 
          position: relative;
          overscroll-behavior-x: none;
          -webkit-overflow-scrolling: touch;
        }
        #__next {
          overflow-x: hidden !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        ::selection { background: rgba(255,107,107,0.2); }
        a { text-decoration: none; }
      `}</style>

      <div style={{ 
        width: "100%", 
        maxWidth: "100%", 
        overflowX: "hidden",
        overflowY: "visible",
        minHeight: "100vh",
        background: "#0a0a0a",
        position: "relative"
      }}>
        <main style={{ 
          minHeight: "100vh", 
          background: "#0a0a0a", 
          color: "white", 
          position: "relative", 
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden"
        }}>
          {/* Animated Background Elements */}
          <div style={{ 
            position: "absolute", 
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden", 
            pointerEvents: "none",
            clip: "rect(0, auto, auto, 0)",
            clipPath: "inset(0)"
          }}>
            <motion.div
              style={{
                position: "absolute",
                top: "-20%",
                right: "-15%",
                width: isMobile ? 400 : 800,
                height: isMobile ? 400 : 800,
                borderRadius: "50%",
                opacity: 0.4,
                background: "radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 50%)",
              }}
              animate={{ scale: [1, 1.1, 1], x: [0, 15, 0], y: [0, -15, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              style={{
                position: "absolute",
                bottom: "-10%",
                left: "-10%",
                width: isMobile ? 300 : 500,
                height: isMobile ? 300 : 500,
                borderRadius: "50%",
                opacity: 0.25,
                background: "radial-gradient(circle, rgba(255,150,100,0.12) 0%, transparent 50%)",
              }}
              animate={{ scale: [1, 1.08, 1], x: [0, 10, 0], y: [0, 10, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Floating Dots */}
            {!isMobile && [...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  width: 4,
                  height: 4,
                  background: "#ff6b6b",
                  borderRadius: "50%",
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{ y: [0, -30, 0], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              />
            ))}
          </div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: smooth, delay: 0.1 }}
            style={{ position: "relative", zIndex: 20, padding: isMobile ? "16px 20px" : "24px" }}
          >
            <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <motion.a
                href="/"
                style={{ display: "flex", alignItems: "center", gap: 8, color: "white", textDecoration: "none" }}
                whileHover={{ opacity: 0.8 }}
              >
                <Image src="/APEX-Final-White.svg?v=100" alt="APEX Logo" width={28} height={28} style={{ height: 28, width: 28 }} priority unoptimized />
                <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.025em" }}>APEX</span>
              </motion.a>

              {isMobile ? (
                <>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 8 }}
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                  <AnimatePresence>
                    {mobileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          background: "#0a0a0a",
                          padding: "24px 20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 20,
                          borderBottom: "1px solid #27272a",
                        }}
                      >
                        <a href="/" onClick={() => setMobileMenuOpen(false)} style={{ color: "#a1a1aa", fontSize: 16, textDecoration: "none" }}>Home</a>
                        <a href="/#method" onClick={() => setMobileMenuOpen(false)} style={{ color: "#a1a1aa", fontSize: 16, textDecoration: "none" }}>How it works</a>
                        <a href="/#pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: "#a1a1aa", fontSize: 16, textDecoration: "none" }}>Pricing</a>
                        <a href="/apply" style={{ color: "#ff6b6b", fontSize: 16, fontWeight: 500, textDecoration: "none" }}>Apply</a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: isTablet ? 20 : 32 }}>
                  <motion.a href="/" style={{ color: "#71717a", fontSize: 14, textDecoration: "none" }} whileHover={{ y: -2, color: "#fff" }}>Home</motion.a>
                  <motion.a href="/#method" style={{ color: "#71717a", fontSize: 14, textDecoration: "none" }} whileHover={{ y: -2, color: "#fff" }}>How it works</motion.a>
                  <motion.a href="/#pricing" style={{ color: "#71717a", fontSize: 14, textDecoration: "none" }} whileHover={{ y: -2, color: "#fff" }}>Pricing</motion.a>
                  <motion.a href="/apply" style={{ color: "#ff6b6b", fontSize: 14, fontWeight: 500, textDecoration: "none" }} whileHover={{ x: 3 }}>Apply</motion.a>
                </div>
              )}
            </div>
          </motion.nav>

          {/* Main Content */}
          <div style={{ position: "relative", zIndex: 10, padding: isMobile ? "40px 20px 60px" : "60px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: smooth, delay: 0.2 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: isMobile ? 24 : 16,
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: isMobile ? 32 : 40,
              }}
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: smooth, delay: 0.3 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}
                >
                  <motion.span
                    style={{ width: 8, height: 8, background: "#ff6b6b", borderRadius: "50%" }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span style={{ color: "#71717a", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>Investor Materials</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: smooth, delay: 0.4 }}
                  style={{ fontSize: isMobile ? 32 : 44, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}
                >
                  Pitch Deck
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  style={{ margin: "12px 0 0", color: "#a1a1aa", fontSize: isMobile ? 15 : 16, lineHeight: 1.6 }}
                >
                  View in browser or download the PDF.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: smooth, delay: 0.5 }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
              >
                <motion.a
                  href={pdfPath}
                  download
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 24px",
                    borderRadius: 100,
                    background: "#ff6b6b",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                  }}
                >
                  <Download style={{ width: 16, height: 16 }} />
                  Download PDF
                </motion.a>
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.03, y: -2, borderColor: "#52525b" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 24px",
                    borderRadius: 100,
                    border: "1px solid #27272a",
                    background: "transparent",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                  }}
                >
                  <ArrowLeft style={{ width: 16, height: 16 }} />
                  Back to site
                </motion.a>
              </motion.div>
            </motion.div>

            {/* PDF Container */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: smooth, delay: 0.6 }}
              style={{
                borderRadius: isMobile ? 16 : 24,
                overflow: "hidden",
                border: "1px solid #27272a",
                background: "#18181b",
                boxShadow: "0 40px 100px -40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset",
              }}
            >
              <div style={{
                padding: isMobile ? "16px" : "24px",
                background: "#18181b",
              }}>
                <div style={{
                  borderRadius: isMobile ? 8 : 12,
                  overflow: "hidden",
                  background: "#27272a",
                }}>
                  <iframe
                    src={`${pdfPath}#view=FitH&navpanes=0&toolbar=0`}
                    title="APEX Pitch Deck"
                    style={{ width: "100%", height: isMobile ? "65vh" : "75vh", border: 0, display: "block" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Mobile Fallback */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ marginTop: 20, color: "#52525b", fontSize: 13, lineHeight: 1.6, textAlign: "center" }}
            >
              Having trouble viewing?{" "}
              <a href={pdfPath} style={{ color: "#ff6b6b", fontWeight: 600, textDecoration: "none" }}>
                Open PDF directly
              </a>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            style={{ padding: "28px 0", borderTop: "1px solid #1f1f23", position: "relative", zIndex: 10 }}
          >
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 24px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 16 : 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "white" }}>
                  <Image src="/APEX-Final-White.svg?v=100" alt="APEX Logo" width={20} height={20} style={{ height: 20, width: 20 }} unoptimized />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#71717a" }}>APEX</span>
                </div>
                <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#52525b" }}>
                  <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Privacy</a>
                  <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Terms</a>
                </div>
              </div>
            </div>
          </motion.footer>
        </main>
      </div>
    </>
  );
}