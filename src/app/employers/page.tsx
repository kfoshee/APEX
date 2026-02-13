"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Search, Filter, Play, Award, Eye, FileText, BarChart3, MessageSquare, ChevronRight, Menu, X, UserCheck, Loader2, TrendingUp, Database, PieChart, ThumbsUp, ThumbsDown, Star, Code, Clock, Briefcase, MapPin, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const BRAND = "APEX";
const smooth: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

/* ── Premium smooth scroll (desktop only, Lenis-style) ───────────── */
function usePremiumScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    let target = window.pageYOffset;
    let current = window.pageYOffset;
    let rafId: number | null = null;
    let running = false;
    const ease = 0.088;

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const clamp = (v: number) => Math.max(0, Math.min(v, maxScroll()));

    const tick = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        running = false;
      }
      window.scrollTo(0, current);
      if (running) rafId = requestAnimationFrame(tick);
    };

    const startRaf = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 36;
      if (e.deltaMode === 2) delta *= window.innerHeight;
      target = clamp(target + delta * 0.55);
      startRaf();
    };

    const onKey = (e: KeyboardEvent) => {
      const step = 120;
      let moved = false;
      switch (e.key) {
        case "ArrowDown": target = clamp(target + step); moved = true; break;
        case "ArrowUp": target = clamp(target - step); moved = true; break;
        case "PageDown": target = clamp(target + window.innerHeight * 0.85); moved = true; break;
        case "PageUp": target = clamp(target - window.innerHeight * 0.85); moved = true; break;
        case "Home": target = 0; moved = true; break;
        case "End": target = maxScroll(); moved = true; break;
        case " ": target = clamp(target + (e.shiftKey ? -1 : 1) * window.innerHeight * 0.85); moved = true; break;
      }
      if (moved) { e.preventDefault(); startRaf(); }
    };

    const onHashClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      target = clamp(el.getBoundingClientRect().top + window.pageYOffset - 20);
      startRaf();
    };

    const onScroll = () => {
      if (!running) {
        target = window.pageYOffset;
        current = window.pageYOffset;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onHashClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onHashClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}

function Nav() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smooth }} style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '16px 20px' : '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', textDecoration: 'none', minWidth: 0 }}>
          <Image src="/APEX-Final-White.svg?v=100" alt="APEX Logo" width={28} height={28} style={{ height: 28, width: 28, flexShrink: 0 }} priority unoptimized />
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.025em' }}>APEX</span>
          <span style={{ fontSize: 12, color: '#71717a', marginLeft: 4, whiteSpace: 'nowrap' }}>for Employers</span>
        </Link>

        {isMobile ? (
          <>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 8, flexShrink: 0 }} aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0a0a0a', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, borderBottom: '1px solid #27272a' }}>
                  <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: '#a1a1aa', fontSize: 16, textDecoration: 'none' }}>How it works</a>
                  <a href="#candidates" onClick={() => setMobileMenuOpen(false)} style={{ color: '#a1a1aa', fontSize: 16, textDecoration: 'none' }}>Browse talent</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: '#a1a1aa', fontSize: 16, textDecoration: 'none' }}>Pricing</a>
                  <a href="#contact" style={{ color: '#ff6b6b', fontSize: 16, fontWeight: 500, textDecoration: 'none' }}>Get Started</a>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <motion.a href="#how-it-works" style={{ color: '#71717a', fontSize: 14, textDecoration: 'none' }} whileHover={{ y: -2, color: '#fff' }}>How it works</motion.a>
            <motion.a href="#candidates" style={{ color: '#71717a', fontSize: 14, textDecoration: 'none' }} whileHover={{ y: -2, color: '#fff' }}>Browse talent</motion.a>
            <motion.a href="#pricing" style={{ color: '#71717a', fontSize: 14, textDecoration: 'none' }} whileHover={{ y: -2, color: '#fff' }}>Pricing</motion.a>
            <motion.a href="#contact" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ff6b6b', color: 'white', fontSize: 14, fontWeight: 500, padding: '10px 20px', borderRadius: 100, textDecoration: 'none', whiteSpace: 'nowrap' }}>Get Started</motion.a>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

function Hero() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} style={{ position: 'relative', background: '#0a0a0a', overflow: 'hidden', padding: isMobile ? '60px 20px 80px' : '100px 24px 120px' }}>
      <motion.div style={{ position: 'absolute', top: '-20%', right: '-10%', width: isMobile ? 400 : 800, height: isMobile ? 400 : 800, borderRadius: '50%', opacity: 0.4, background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 50%)' }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: isMobile ? 300 : 600, height: isMobile ? 300 : 600, borderRadius: '50%', opacity: 0.3, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 50%)' }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 80, alignItems: 'center' }}>
          <div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} style={{ fontSize: isMobile ? 36 : (isTablet ? 48 : 64), fontWeight: 800, color: 'white', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }}>
              Hire talent you can <span style={{ color: '#ff6b6b' }}>actually verify</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} style={{ color: '#a1a1aa', fontSize: isMobile ? 16 : 18, lineHeight: 1.7, marginBottom: 32 }}>
              Stop guessing from resumes. Browse portfolios of real work, ranked against peers. See exactly what candidates can do before you hire.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <motion.a href="#candidates" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ff6b6b', color: 'white', fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 100, textDecoration: 'none', boxShadow: '0 8px 30px -5px rgba(255,107,107,0.4)', whiteSpace: 'nowrap' }}>
                Browse Candidates <ArrowRight style={{ width: 16, height: 16 }} />
              </motion.a>
              <motion.a href="#how-it-works" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 15, fontWeight: 500, padding: '14px 28px', borderRadius: 100, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                See How It Works
              </motion.a>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 40, scale: 0.95 }} animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.4 }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ padding: isMobile ? 16 : 24, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <Search style={{ width: 18, height: 18, color: '#71717a', flexShrink: 0 }} />
                  <span style={{ color: '#71717a', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Data Analytics candidates</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <Filter style={{ width: 16, height: 16, color: '#71717a' }} />
                  <span style={{ color: '#52525b', fontSize: 13 }}>Filters</span>
                </div>
              </div>

              <div style={{ padding: isMobile ? 12 : 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { name: 'Sarah Chen', rank: 'Top 5%', initials: 'SC', color: '#ff6b6b', skills: ['SQL', 'Python', 'Tableau'] },
                  { name: 'Marcus Johnson', rank: 'Top 8%', initials: 'MJ', color: '#667eea', skills: ['Python', 'R', 'PowerBI'] },
                  { name: 'Emily Park', rank: 'Top 12%', initials: 'EP', color: '#10b981', skills: ['SQL', 'Excel', 'Looker'] },
                ].map((c, i) => (
                  <motion.div key={c.name} initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }} whileHover={{ x: 4, background: 'rgba(255,255,255,0.08)' }} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: isMobile ? 12 : 16, cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${c.color}, ${c.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{c.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{c.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${c.color}20`, color: c.color, flexShrink: 0, whiteSpace: 'nowrap' }}>{c.rank}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                        {c.skills.map(s => (
                          <span key={s} style={{ fontSize: 11, color: '#71717a', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight style={{ width: 18, height: 18, color: '#52525b', flexShrink: 0 }} />
                  </motion.div>
                ))}
              </div>

              <div style={{ padding: isMobile ? 12 : 16, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <span style={{ color: '#71717a', fontSize: 13 }}>All candidates verified through APEX challenges</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    { icon: Search, title: 'Browse portfolios', desc: 'Filter by skills and rank.', color: '#ff6b6b' },
    { icon: Eye, title: 'Review verified work', desc: 'See rubric scores and proof.', color: '#10b981' },
    { icon: MessageSquare, title: 'Connect directly', desc: 'Message candidates. Book interviews.', color: '#8b5cf6' },
    { icon: UserCheck, title: 'Hire with confidence', desc: 'Make offers with clarity.', color: '#f59e0b' },
  ];

  return (
    <section id="how-it-works" ref={ref} style={{ background: 'white', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 72 }}>
          <span style={{ color: '#ff6b6b', fontSize: 14, fontWeight: 600 }}>How it works</span>
          <h2 style={{ marginTop: 12, fontSize: isMobile ? 28 : 40, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>Hiring made simple</h2>
          <p style={{ marginTop: 16, color: '#71717a', fontSize: 17, maxWidth: 500, margin: '16px auto 0' }}>From discovery to offer in record time</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: isMobile ? 40 : 40 }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                style={{
                  width: 80,
                  height: 80,
                  background: `${step.color}10`,
                  borderRadius: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                }}
              >
                <step.icon style={{ width: 32, height: 32, color: step.color }} />
              </motion.div>

              <div style={{ fontSize: 12, fontWeight: 700, color: step.color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step {i + 1}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BarChartComponent({ isInView }: { isInView: boolean }) {
  const chartData = [
    { label: 'New', value: 35, color: '#10b981' },
    { label: 'Active', value: 15, color: '#10b981' },
    { label: 'At-Risk', value: 65, color: '#f59e0b' },
    { label: 'Dormant', value: 85, color: '#ff6b6b' },
    { label: 'Churned', value: 95, color: '#ff6b6b' },
  ];

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <BarChart3 style={{ width: 14, height: 14, color: '#ff6b6b', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: '#a1a1aa' }}>Churn Risk by Customer Segment</span>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, gap: 12 }}>
          {chartData.map((item, i) => {
            const barHeight = Math.round((item.value / 100) * 120);
            return (
              <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', minWidth: 0 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={isInView ? { height: barHeight } : { height: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: smooth }}
                  style={{
                    width: '100%',
                    maxWidth: 36,
                    backgroundColor: item.color,
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <span style={{ fontSize: 10, color: '#71717a', marginTop: 8, textAlign: 'center', whiteSpace: 'nowrap' }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PortfolioShowcase() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<'overview' | 'challenge' | 'evaluation'>('overview');

  const candidate = {
    name: 'Sarah Chen',
    rank: 'Top 5%',
    score: 94,
    initials: 'SC',
    color: '#ff6b6b',
    track: 'Data Analytics',
    location: 'San Francisco, CA',
    availability: 'Immediately',
  };

  const skills = [
    { name: 'SQL', level: 95 },
    { name: 'Python', level: 88 },
    { name: 'Tableau', level: 92 },
    { name: 'dbt', level: 78 },
    { name: 'Looker', level: 85 },
  ];

  const challenges = [
    { company: 'Rushly', title: 'Customer Churn Prediction', rank: 'Top 1%', score: 96 },
    { company: 'Flowpay', title: 'Revenue Dashboard', rank: 'Top 3%', score: 94 },
    { company: 'Nestaway', title: 'Pricing Optimization', rank: 'Top 5%', score: 91 },
    { company: 'Melodix', title: 'A/B Test Analysis', rank: 'Top 8%', score: 89 },
  ];

  const evaluation = {
    technical: 96,
    communication: 92,
    business: 94,
    comments: [
      { author: 'Technical Reviewer', rating: 5, text: 'Excellent SQL optimization and clean Python code. Feature engineering was particularly impressive. Used window functions effectively.' },
      { author: 'Business Reviewer', rating: 5, text: 'Clear understanding of business impact. Recommendations were actionable and well-prioritized. Great stakeholder communication.' },
      { author: 'Panel Member', rating: 4, text: 'Strong presentation skills. Handled questions well and showed depth of understanding. Minor areas for improvement in visualization choices.' },
    ]
  };

  return (
    <section id="candidates" ref={ref} style={{ background: '#0a0a0a', padding: isMobile ? '60px 20px' : '100px 24px', position: 'relative', overflow: 'hidden' }}>
      <motion.div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 800, background: 'radial-gradient(circle, rgba(255,107,107,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 72 }}>
          <span style={{ color: '#ff6b6b', fontSize: 14, fontWeight: 600 }}>Browse talent</span>
          <h2 style={{ marginTop: 12, fontSize: isMobile ? 28 : 40, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>See what a profile looks like</h2>
          <p style={{ marginTop: 16, color: '#71717a', fontSize: 17 }}>Real candidates, verified portfolios</p>
        </motion.div>

        {/* Candidate Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: isMobile ? 20 : 32 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 0 }}>
                <motion.div whileHover={{ scale: 1.05 }} style={{ width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, borderRadius: 20, background: `linear-gradient(135deg, ${candidate.color}, ${candidate.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: isMobile ? 22 : 28, fontWeight: 700, flexShrink: 0 }}>{candidate.initials}</motion.div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: 'white', marginBottom: 8 }}>{candidate.name}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 10 : 16, fontSize: 14, color: '#a1a1aa' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}><Briefcase style={{ width: 14, height: 14, flexShrink: 0 }} />{candidate.track}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}><MapPin style={{ width: 14, height: 14, flexShrink: 0 }} />{candidate.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}><Clock style={{ width: 14, height: 14, flexShrink: 0 }} />{candidate.availability}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: isMobile ? 32 : 40, fontWeight: 900, color: 'white' }}>{candidate.score}</div>
                  <div style={{ fontSize: 12, color: '#71717a' }}>Overall Score</div>
                </div>
                <div style={{ background: candidate.color, color: 'white', fontSize: 14, fontWeight: 700, padding: '12px 24px', borderRadius: 100, whiteSpace: 'nowrap' }}>{candidate.rank}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'challenge', label: 'Challenge Work' },
              { id: 'evaluation', label: 'Evaluation' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                whileHover={{ background: 'rgba(255,255,255,0.05)' }}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: activeTab === tab.id ? 'rgba(255,107,107,0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #ff6b6b' : '2px solid transparent',
                  color: activeTab === tab.id ? '#ff6b6b' : '#71717a',
                  fontSize: isMobile ? 13 : 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
                  {/* Quick Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      { icon: FileText, label: 'Projects', value: '12', color: '#ff6b6b' },
                      { icon: Award, label: 'Challenges', value: '4', color: '#10b981' },
                      { icon: Star, label: 'Avg Rank', value: 'Top 4%', color: '#f59e0b' },
                    ].map((stat, i) => (
                      <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: isMobile ? 16 : 20, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', minWidth: 0 }}>
                        <stat.icon style={{ width: 20, height: 20, color: stat.color, marginBottom: 8 }} />
                        <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 800, color: 'white' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#71717a' }}>{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: isMobile ? 20 : 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills Assessment</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {skills.map((skill, i) => (
                        <motion.div key={skill.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 14, color: '#a1a1aa' }}>{skill.name}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{skill.level}</span>
                          </div>
                          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }} style={{ height: '100%', background: `linear-gradient(90deg, #ff6b6b, #ff6b6b88)`, borderRadius: 3 }} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Completed Challenges */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: isMobile ? 20 : 24, border: '1px solid rgba(255,255,255,0.05)', minWidth: 0 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed Challenges</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {challenges.map((ch, i) => (
                      <motion.div key={ch.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} whileHover={{ background: 'rgba(255,255,255,0.05)' }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: isMobile ? 12 : 16, cursor: 'pointer', transition: 'all 0.2s ease', gap: 12 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>{ch.title}</div>
                          <div style={{ fontSize: 12, color: '#71717a' }}>{ch.company}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{ch.score}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: '#ff6b6b20', color: '#ff6b6b', whiteSpace: 'nowrap' }}>{ch.rank}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'challenge' && (
            <motion.div key="challenge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {/* Challenge Header */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: isMobile ? 20 : 28, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ background: '#ff6b6b20', color: '#ff6b6b', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap' }}>Rushly</span>
                      <span style={{ background: '#10b98120', color: '#10b981', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap' }}>Top 1%</span>
                      <span style={{ color: '#52525b', fontSize: 12, whiteSpace: 'nowrap' }}>2 weeks</span>
                    </div>
                    <h3 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>Customer Churn Prediction</h3>
                    <p style={{ fontSize: 14, color: '#a1a1aa', margin: 0, maxWidth: 600 }}>Analyze customer behavior data to identify at-risk customers and recommend retention strategies for a subscription-based delivery service.</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
                    {['SQL', 'Python', 'Tableau'].map(t => (
                      <span key={t} style={{ background: 'rgba(255,255,255,0.05)', color: '#a1a1aa', fontSize: 12, padding: '6px 12px', borderRadius: 6, whiteSpace: 'nowrap' }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Key Results */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 16 }}>
                  {[
                    { label: 'At-Risk Revenue', value: '$2.3M', sub: '+34% improvement' },
                    { label: 'Model Accuracy', value: '89%', sub: 'F1 Score' },
                    { label: 'Churn Reduction', value: '23%', sub: 'Over 6 months' },
                    { label: 'Recommendations', value: '12', sub: 'Actionable items' },
                  ].map((m, i) => (
                    <motion.div key={m.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: isMobile ? 12 : 16, textAlign: 'center', minWidth: 0 }}>
                      <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: 'white' }}>{m.value}</div>
                      <div style={{ fontSize: isMobile ? 11 : 12, color: '#71717a', marginTop: 4 }}>{m.label}</div>
                      {m.sub && <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>{m.sub}</div>}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Work Samples Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 20, marginBottom: 20 }}>
                {/* SQL Query Sample */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <Database style={{ width: 14, height: 14, color: '#8b5cf6', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>churn_analysis.sql</span>
                    </div>
                    <span style={{ fontSize: 10, color: '#52525b', flexShrink: 0 }}>247 lines</span>
                  </div>
                  <div style={{ padding: 16, fontFamily: 'monospace', fontSize: 11, color: '#a1a1aa', lineHeight: 1.7, maxHeight: 200, overflow: 'hidden' }}>
                    <div><span style={{ color: '#8b5cf6' }}>WITH</span> customer_metrics <span style={{ color: '#8b5cf6' }}>AS</span> (</div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: '#8b5cf6' }}>SELECT</span></div>
                    <div style={{ paddingLeft: 24 }}>c.customer_id,</div>
                    <div style={{ paddingLeft: 24 }}>c.signup_date,</div>
                    <div style={{ paddingLeft: 24, overflowWrap: 'break-word', wordBreak: 'break-all' }}><span style={{ color: '#f59e0b' }}>DATEDIFF</span>(day, c.signup_date, <span style={{ color: '#f59e0b' }}>GETDATE</span>()) <span style={{ color: '#8b5cf6' }}>AS</span> tenure_days,</div>
                    <div style={{ paddingLeft: 24, overflowWrap: 'break-word', wordBreak: 'break-all' }}><span style={{ color: '#f59e0b' }}>COUNT</span>(<span style={{ color: '#8b5cf6' }}>DISTINCT</span> o.order_id) <span style={{ color: '#8b5cf6' }}>AS</span> total_orders,</div>
                    <div style={{ paddingLeft: 24, overflowWrap: 'break-word', wordBreak: 'break-all' }}><span style={{ color: '#f59e0b' }}>AVG</span>(o.order_value) <span style={{ color: '#8b5cf6' }}>AS</span> avg_order_value,</div>
                    <div style={{ paddingLeft: 24, overflowWrap: 'break-word', wordBreak: 'break-all' }}><span style={{ color: '#f59e0b' }}>MAX</span>(o.order_date) <span style={{ color: '#8b5cf6' }}>AS</span> last_order_date</div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: '#8b5cf6' }}>FROM</span> customers c</div>
                    <div style={{ paddingLeft: 16, overflowWrap: 'break-word', wordBreak: 'break-all' }}><span style={{ color: '#8b5cf6' }}>LEFT JOIN</span> orders o <span style={{ color: '#8b5cf6' }}>ON</span> c.customer_id = o.customer_id</div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: '#8b5cf6' }}>GROUP BY</span> c.customer_id, c.signup_date</div>
                    <div>),</div>
                    <div style={{ color: '#52525b' }}>-- ... more code</div>
                  </div>
                </motion.div>

                {/* Python Model */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <Code style={{ width: 14, height: 14, color: '#10b981', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#a1a1aa' }}>churn_model.py</span>
                    </div>
                    <span style={{ fontSize: 10, color: '#52525b', flexShrink: 0 }}>189 lines</span>
                  </div>
                  <div style={{ padding: 16, fontFamily: 'monospace', fontSize: 11, color: '#a1a1aa', lineHeight: 1.7, maxHeight: 200, overflow: 'hidden' }}>
                    <div><span style={{ color: '#8b5cf6' }}>import</span> pandas <span style={{ color: '#8b5cf6' }}>as</span> pd</div>
                    <div style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}><span style={{ color: '#8b5cf6' }}>from</span> sklearn.ensemble <span style={{ color: '#8b5cf6' }}>import</span> RandomForestClassifier</div>
                    <div style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}><span style={{ color: '#8b5cf6' }}>from</span> sklearn.model_selection <span style={{ color: '#8b5cf6' }}>import</span> train_test_split</div>
                    <div style={{ marginTop: 8 }}></div>
                    <div style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}><span style={{ color: '#8b5cf6' }}>def</span> <span style={{ color: '#f59e0b' }}>train_churn_model</span>(df):</div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: '#52525b' }}># Feature engineering</span></div>
                    <div style={{ paddingLeft: 16, overflowWrap: 'break-word', wordBreak: 'break-all' }}>features = [<span style={{ color: '#10b981' }}>'tenure_days'</span>, <span style={{ color: '#10b981' }}>'total_orders'</span>,</div>
                    <div style={{ paddingLeft: 48, overflowWrap: 'break-word', wordBreak: 'break-all' }}><span style={{ color: '#10b981' }}>'avg_order_value'</span>, <span style={{ color: '#10b981' }}>'days_since_last'</span>]</div>
                    <div style={{ paddingLeft: 16 }}>X = df[features]</div>
                    <div style={{ paddingLeft: 16 }}>y = df[<span style={{ color: '#10b981' }}>'churned'</span>]</div>
                    <div style={{ paddingLeft: 16, marginTop: 8 }}>model = RandomForestClassifier(</div>
                    <div style={{ paddingLeft: 32 }}>n_estimators=<span style={{ color: '#f59e0b' }}>100</span>,</div>
                    <div style={{ paddingLeft: 32 }}>max_depth=<span style={{ color: '#f59e0b' }}>10</span></div>
                    <div style={{ paddingLeft: 16 }}>)</div>
                  </div>
                </motion.div>
              </div>

              {/* Charts Row */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 20, marginBottom: 20 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <BarChartComponent isInView={true} />
                </motion.div>

                {/* Feature Importance */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp style={{ width: 14, height: 14, color: '#8b5cf6', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#a1a1aa' }}>Feature Importance</span>
                  </div>
                  <div style={{ padding: isMobile ? 16 : 24 }}>
                    {[
                      { name: 'Days Since Last Order', value: 0.32 },
                      { name: 'Order Frequency', value: 0.28 },
                      { name: 'Customer Tenure', value: 0.18 },
                      { name: 'Avg Order Value', value: 0.14 },
                      { name: 'Support Tickets', value: 0.08 },
                    ].map((f, i) => (
                      <motion.div key={f.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }} style={{ marginBottom: i < 4 ? 12 : 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                          <span style={{ fontSize: 12, color: '#a1a1aa', minWidth: 0 }}>{f.name}</span>
                          <span style={{ fontSize: 12, color: 'white', fontWeight: 600, flexShrink: 0 }}>{(f.value * 100).toFixed(0)}%</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${f.value * 100}%` }} transition={{ duration: 0.5, delay: 0.6 + i * 0.05 }} style={{ height: '100%', background: '#8b5cf6', borderRadius: 2 }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Defense Recording + Dashboard */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: isMobile ? 20 : 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <motion.div whileHover={{ scale: 1.05 }} style={{ width: isMobile ? 52 : 64, height: isMobile ? 52 : 64, background: '#ff6b6b20', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <Play style={{ width: isMobile ? 22 : 28, height: isMobile ? 22 : 28, color: '#ff6b6b', marginLeft: 2 }} />
                    </motion.div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: 'white', marginBottom: 4 }}>Live Defense Recording</div>
                      <div style={{ fontSize: 13, color: '#71717a' }}>45 min • Watch Sarah present and answer panel questions</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: '#10b981', background: '#10b98120', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>HD Quality</span>
                        <span style={{ fontSize: 11, color: '#8b5cf6', background: '#8b5cf620', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>Timestamped</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: isMobile ? 20 : 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <motion.div whileHover={{ scale: 1.05 }} style={{ width: isMobile ? 52 : 64, height: isMobile ? 52 : 64, background: '#10b98120', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <PieChart style={{ width: isMobile ? 22 : 28, height: isMobile ? 22 : 28, color: '#10b981' }} />
                    </motion.div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: 'white', marginBottom: 4 }}>Interactive Dashboard</div>
                      <div style={{ fontSize: 13, color: '#71717a' }}>Tableau • Explore the churn analysis dashboard</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: '#f59e0b', background: '#f59e0b20', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>12 Views</span>
                        <span style={{ fontSize: 11, color: '#ff6b6b', background: '#ff6b6b20', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>Filters Enabled</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'evaluation' && (
            <motion.div key="evaluation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {/* Scores */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
                {[
                  { label: 'Technical Skills', score: evaluation.technical, color: '#10b981', desc: 'SQL, Python, Data Modeling' },
                  { label: 'Communication', score: evaluation.communication, color: '#8b5cf6', desc: 'Presentation, Documentation' },
                  { label: 'Business Acumen', score: evaluation.business, color: '#f59e0b', desc: 'Strategy, Recommendations' },
                ].map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: isMobile ? 20 : 28, border: '1px solid rgba(255,255,255,0.05)', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{item.label}</span>
                        <p style={{ fontSize: 12, color: '#52525b', margin: '4px 0 0' }}>{item.desc}</p>
                      </div>
                      <span style={{ fontSize: isMobile ? 28 : 32, fontWeight: 900, color: item.color, flexShrink: 0 }}>{item.score}</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} style={{ height: '100%', background: item.color, borderRadius: 4 }} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Reviewer Comments */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: isMobile ? 20 : 28, border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 24 }}>Reviewer Feedback</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {evaluation.comments.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: isMobile ? 16 : 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
                        <span style={{ fontSize: 13, color: '#ff6b6b', fontWeight: 600 }}>{c.author}</span>
                        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} style={{ width: 14, height: 14, color: j < c.rating ? '#f59e0b' : '#27272a', fill: j < c.rating ? '#f59e0b' : 'none' }} />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.7, margin: 0 }}>{c.text}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Employer Actions */}
                <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 13, color: '#71717a', marginBottom: 16 }}>Your evaluation</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#10b98120', border: '1px solid #10b98140', color: '#10b981', fontSize: 14, fontWeight: 600, padding: '16px 20px', borderRadius: 12, cursor: 'pointer' }}>
                      <ThumbsUp style={{ width: 18, height: 18 }} /> Shortlist
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#71717a', fontSize: 14, fontWeight: 600, padding: '16px 20px', borderRadius: 12, cursor: 'pointer' }}>
                      <ThumbsDown style={{ width: 18, height: 18 }} /> Pass
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact CTA */}
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }} style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, minWidth: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#ff6b6b', color: 'white', fontSize: 14, fontWeight: 600, padding: '16px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <MessageSquare style={{ width: 16, height: 16 }} /> Contact Sarah
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, minWidth: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, fontWeight: 600, padding: '16px 24px', borderRadius: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <ExternalLink style={{ width: 16, height: 16 }} /> View Full Portfolio
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

function WhyApex() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const comparisons = [
    { traditional: 'Resume screening', apex: 'Portfolio review' },
    { traditional: 'Phone screen guessing', apex: 'Watch live defenses' },
    { traditional: 'Take-home projects', apex: 'Pre-verified work' },
    { traditional: 'Reference calls', apex: 'Rubric scores' },
  ];

  return (
    <section ref={ref} style={{ background: 'white', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 72 }}>
          <span style={{ color: '#ff6b6b', fontSize: 14, fontWeight: 600 }}>The difference</span>
          <h2 style={{ marginTop: 12, fontSize: isMobile ? 28 : 40, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>Skip the hiring guesswork</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr', gap: isMobile ? 24 : 0, alignItems: 'stretch' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ background: '#f4f4f5', borderRadius: 24, padding: isMobile ? 24 : 32 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Traditional hiring</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {comparisons.map((item, i) => (
                <motion.div key={item.traditional} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 + i * 0.1 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <X style={{ width: 18, height: 18, color: '#a1a1aa', flexShrink: 0 }} />
                  <span style={{ color: '#71717a', fontSize: 15 }}>{item.traditional}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }}>
                <ArrowRight style={{ width: 32, height: 32, color: '#d4d4d8' }} />
              </motion.div>
            </div>
          )}

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} whileHover={{ scale: 1.02 }} style={{ background: '#0a0a0a', borderRadius: 24, padding: isMobile ? 24 : 32, position: 'relative', overflow: 'hidden' }}>
            <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, transparent 50%)' }} animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 4, repeat: Infinity }} />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ff6b6b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24, position: 'relative' }}>With APEX</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
              {comparisons.map((item, i) => (
                <motion.div key={item.apex} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.4 + i * 0.1 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Check style={{ width: 18, height: 18, color: '#10b981', flexShrink: 0 }} />
                  <span style={{ color: 'white', fontSize: 15, fontWeight: 500 }}>{item.apex}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    { name: 'Browse', price: 'Free', desc: 'Search and filter candidates', features: ['Browse all portfolios', 'See rankings & scores', 'View public work samples', 'Basic filters'], cta: 'Start Browsing', popular: false },
    { name: 'Connect', price: '$299', period: '/mo', desc: 'Contact and recruit candidates', features: ['Everything in Browse', 'Unlimited messages', 'Watch defense recordings', 'Advanced filters', 'Priority support'], cta: 'Get Started', popular: true },
    { name: 'Enterprise', price: 'Custom', desc: 'For high-volume hiring', features: ['Everything in Connect', 'Dedicated account manager', 'Custom integrations', 'Bulk candidate exports', 'Co-branded challenges'], cta: 'Contact Sales', popular: false },
  ];

  return (
    <section id="pricing" ref={ref} style={{ background: '#fafafa', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 72 }}>
          <span style={{ color: '#ff6b6b', fontSize: 14, fontWeight: 600 }}>Pricing</span>
          <h2 style={{ marginTop: 12, fontSize: isMobile ? 28 : 40, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>Simple, transparent pricing</h2>
          <p style={{ marginTop: 16, color: '#71717a', fontSize: 17 }}>Start free. Upgrade when you're ready to hire.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }} whileHover={{ y: -8 }} style={{ background: plan.popular ? '#0a0a0a' : 'white', borderRadius: 24, padding: isMobile ? 24 : 32, border: plan.popular ? '2px solid #ff6b6b' : '1px solid #e5e5e5', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#ff6b6b', color: 'white', fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 100, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Most Popular</div>
              )}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: plan.popular ? 'white' : '#0a0a0a', marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: isMobile ? 32 : 40, fontWeight: 900, color: plan.popular ? 'white' : '#0a0a0a' }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: 16, color: '#71717a' }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: 14, color: '#71717a', marginTop: 8 }}>{plan.desc}</p>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Check style={{ width: 16, height: 16, color: '#10b981', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: plan.popular ? '#a1a1aa' : '#52525b' }}>{f}</span>
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ width: '100%', background: plan.popular ? '#ff6b6b' : '#0a0a0a', border: 'none', color: 'white', fontSize: 14, fontWeight: 600, padding: '14px 24px', borderRadius: 12, cursor: 'pointer' }}>{plan.cta}</motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', company: '', roles: '' });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canSubmit = formData.firstName && formData.lastName && formData.email && formData.company;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));
    form.append("type", "employer");

    try {
      const res = await fetch("/api/apply", { method: "POST", body: form });
      if (!res.ok) { setStatus("error"); return; }
      setStatus("sent");
    } catch { setStatus("error"); }
  }

  return (
    <section id="contact" ref={ref} style={{ background: 'white', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '48px 0' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} style={{ width: 80, height: 80, background: '#ff6b6b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }}>
                  <Check style={{ width: 40, height: 40, color: 'white' }} strokeWidth={3} />
                </motion.div>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontSize: 28, fontWeight: 800, color: '#0a0a0a', marginBottom: 12 }}>We'll be in touch!</motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ color: '#71717a', fontSize: 16 }}>Expect to hear from us within 24 hours.</motion.p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: 48 }}>
                <span style={{ color: '#ff6b6b', fontSize: 14, fontWeight: 600 }}>Get started</span>
                <h2 style={{ marginTop: 12, fontSize: isMobile ? 28 : 40, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>Ready to hire differently?</h2>
                <p style={{ marginTop: 16, color: '#71717a', fontSize: 17 }}>Start browsing verified candidates today</p>
              </motion.div>

              <motion.form initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} onSubmit={onSubmit} style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 24, padding: isMobile ? 24 : 36 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#52525b', marginBottom: 8 }}>First name <span style={{ color: '#ff6b6b' }}>*</span></label>
                    <input type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="Jane" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 15, outline: 'none', background: 'white', color: '#0a0a0a', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#52525b', marginBottom: 8 }}>Last name <span style={{ color: '#ff6b6b' }}>*</span></label>
                    <input type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Smith" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 15, outline: 'none', background: 'white', color: '#0a0a0a', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#52525b', marginBottom: 8 }}>Work email <span style={{ color: '#ff6b6b' }}>*</span></label>
                  <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="jane@company.com" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 15, outline: 'none', background: 'white', color: '#0a0a0a', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#52525b', marginBottom: 8 }}>Company <span style={{ color: '#ff6b6b' }}>*</span></label>
                  <input type="text" value={formData.company} onChange={(e) => updateField('company', e.target.value)} placeholder="Acme Inc." style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 15, outline: 'none', background: 'white', color: '#0a0a0a', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#52525b', marginBottom: 8 }}>What roles are you hiring for?</label>
                  <textarea value={formData.roles} onChange={(e) => updateField('roles', e.target.value)} placeholder="e.g. Data Analyst, Junior Engineer..." rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 15, outline: 'none', resize: 'vertical', background: 'white', color: '#0a0a0a', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <motion.button type="submit" disabled={!canSubmit || status === "sending"} whileHover={{ scale: canSubmit && status !== "sending" ? 1.02 : 1 }} whileTap={{ scale: canSubmit && status !== "sending" ? 0.98 : 1 }} style={{ width: '100%', background: '#0a0a0a', color: 'white', fontSize: 15, fontWeight: 600, padding: '16px 24px', borderRadius: 12, border: 'none', cursor: canSubmit && status !== "sending" ? 'pointer' : 'not-allowed', opacity: canSubmit ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.3s ease' }}>
                  {status === "sending" ? (<><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />Submitting...</>) : (<>Get Started <ArrowRight style={{ width: 16, height: 16 }} /></>)}
                </motion.button>
                {status === "error" && <p style={{ marginTop: 12, textAlign: 'center', fontSize: 14, color: '#f87171' }}>Something went wrong. Please try again.</p>}
                <p style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: '#a1a1aa' }}>We'll reach out within 24 hours</p>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Footer() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <footer style={{ padding: isMobile ? '40px 20px' : '60px 24px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 24 : 0, marginBottom: 32 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', textDecoration: 'none' }}>
            <Image src="/APEX-Final-White.svg?v=100" alt="APEX Logo" width={24} height={24} style={{ height: 24, width: 24 }} unoptimized />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{BRAND}</span>
          </Link>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/" style={{ color: '#71717a', fontSize: 14, textDecoration: 'none' }}>For Students</Link>
            <a href="#candidates" style={{ color: '#71717a', fontSize: 14, textDecoration: 'none' }}>Browse Talent</a>
            <a href="#pricing" style={{ color: '#71717a', fontSize: 14, textDecoration: 'none' }}>Pricing</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 0 }}>
          <span style={{ color: '#52525b', fontSize: 13 }}>© 2026 APEX. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#52525b' }}>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy</a>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function EmployersPage() {
  usePremiumScroll();

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *{font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;margin:0;padding:0;box-sizing:border-box}
        html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden}
        body{margin:0;padding:0;overflow-x:hidden;-webkit-overflow-scrolling:touch}
        ::selection{background:rgba(255,107,107,0.2)}
        a{text-decoration:none}
        input,textarea{font-family:inherit}
        input::placeholder,textarea::placeholder{color:#a1a1aa}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
      <main style={{ minHeight: '100vh', background: '#0a0a0a', overflowX: 'hidden' }}>
        <Nav />
        <Hero />
        <HowItWorks />
        <PortfolioShowcase />
        <WhyApex />
        <Pricing />
        <Contact />
        <Footer />
      </main>
    </>
  );
}