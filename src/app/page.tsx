"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Play, RotateCcw, Lock, BarChart3, Rocket, Code, Palette, TrendingUp, DollarSign, Users, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const BRAND = "APEX";
const APPLY_URL = "/apply";
const PRICE = "$500/mo";
const smooth: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: smooth, delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, ease: smooth, delay },
  }),
};

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} style={{ position: 'relative', minHeight: '100vh', background: '#0a0a0a', overflow: 'hidden' }}>
      <motion.div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-20%',
          width: 900,
          height: 900,
          borderRadius: '50%',
          opacity: 0.5,
          background: 'radial-gradient(circle, rgba(255,107,107,0.2) 0%, transparent 50%)',
        }}
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          opacity: 0.3,
          background: 'radial-gradient(circle, rgba(255,150,100,0.15) 0%, transparent 50%)',
        }}
        animate={{ scale: [1, 1.1, 1], x: [0, 15, 0], y: [0, 15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 4,
            height: 4,
            background: '#ff6b6b',
            borderRadius: '50%',
            left: `${15 + i * 18}%`,
            top: `${25 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -40, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        />
      ))}

      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: smooth, delay: 0.2 }}
        style={{ position: 'relative', zIndex: 20, padding: '24px' }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', textDecoration: 'none' }}>
            <Image src="/APEX-Final-White.svg?v=100" alt="APEX" width={28} height={28} style={{ height: 28, width: 28 }} priority unoptimized />
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.025em' }}>APEX</span>
          </motion.a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <motion.a href="#method" style={{ color: '#71717a', fontSize: 14, textDecoration: 'none' }} whileHover={{ y: -2, color: '#fff' }}>How it works</motion.a>
            <motion.a href="#what" style={{ color: '#71717a', fontSize: 14, textDecoration: 'none' }} whileHover={{ y: -2, color: '#fff' }}>What is APEX</motion.a>
            <motion.a href="#pricing" style={{ color: '#71717a', fontSize: 14, textDecoration: 'none' }} whileHover={{ y: -2, color: '#fff' }}>Pricing</motion.a>
            <motion.a href={APPLY_URL} style={{ color: '#ff6b6b', fontSize: 14, fontWeight: 500, textDecoration: 'none' }} whileHover={{ x: 3 }}>Apply</motion.a>
          </div>
        </div>
      </motion.nav>

      <motion.div style={{ y, opacity, position: 'relative', zIndex: 10, padding: '15vh 24px 128px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: smooth, delay: 0.3 }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <motion.span style={{ width: 8, height: 8, background: '#ff6b6b', borderRadius: '50%' }} animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
            <span style={{ color: '#71717a', fontSize: 14 }}>Cohort now open</span>
          </motion.div>

          <motion.h1 style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: 700, color: 'white', lineHeight: 0.95, letterSpacing: '-0.04em', maxWidth: 1000 }}>
            <motion.span initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: smooth, delay: 0.4 }} style={{ display: 'block' }}>Get hired for</motion.span>
            <motion.span initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: smooth, delay: 0.55 }} style={{ display: 'block', color: '#ff6b6b' }}>what you can do</motion.span>
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: smooth, delay: 0.8 }} style={{ marginTop: 48, marginLeft: 'auto', maxWidth: 420 }}>
            <p style={{ color: '#a1a1aa', fontSize: 18, lineHeight: 1.7 }}>Skip the traditional degree. Build a portfolio employers can actually evaluate.</p>
            <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
              <motion.a href={APPLY_URL} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ff6b6b', color: 'white', fontSize: 14, fontWeight: 500, padding: '12px 24px', borderRadius: 100, textDecoration: 'none' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                Start building
                <ArrowRight style={{ width: 16, height: 16 }} />
              </motion.a>
              <span style={{ color: '#52525b', fontSize: 14 }}>{PRICE}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: '#27272a' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, ease: smooth, delay: 0.8 }} />
    </section>
  );
}

function Step({ number, title, description, mockup, reverse = false }: { number: string; title: string; description: string; mockup: React.ReactNode; reverse?: boolean; }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 80, marginBottom: 120, flexDirection: reverse ? 'row-reverse' : 'row' }}>
      <motion.div initial={{ opacity: 0, x: reverse ? 60 : -60, y: 30 }} animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}} transition={{ duration: 0.8, ease: smooth }} style={{ flex: 1, maxWidth: 420 }}>
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, ease: smooth, delay: 0.1 }} style={{ color: '#ff6b6b', fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{number}</motion.div>
        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: smooth, delay: 0.15 }} style={{ fontSize: 36, fontWeight: 800, color: '#0a0a0a', marginBottom: 16, letterSpacing: '-0.02em' }}>{title}</motion.h3>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: smooth, delay: 0.25 }} style={{ fontSize: 17, color: '#71717a', lineHeight: 1.7, margin: 0 }}>{description}</motion.p>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: reverse ? -60 : 60, y: 30, scale: 0.9 }} animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}} transition={{ duration: 0.8, ease: smooth, delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{mockup}</motion.div>
    </div>
  );
}

function MockupFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (<div style={{ width: 420, background: dark ? '#18181b' : '#fff', borderRadius: 24, boxShadow: dark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>{children}</div>);
}

function Journey() {
  const ref = useRef(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-50px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-50px" });

  return (
    <section id="method" ref={ref} style={{ background: '#fafafa' }}>
      <div style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div ref={headerRef} initial={{ opacity: 0, y: 40 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: smooth }} style={{ textAlign: 'center', marginBottom: 80 }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={headerInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.1 }} style={{ color: '#ff6b6b', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>The APEX Method</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }} style={{ fontSize: 40, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em', margin: 0 }}>How it works</motion.h2>
        </motion.div>

        <Step number="01" title="Pick Your Track" description="Choose from Data Analytics, Product, or Engineering tracks" mockup={<MockupFrame><div style={{ padding: 28 }}><div style={{ marginBottom: 24 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0a0a0a', marginBottom: 6 }}>Welcome back, Alex</div><div style={{ fontSize: 14, color: '#71717a' }}>Continue building your portfolio</div></div><div style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.08) 0%, rgba(255,107,107,0.02) 100%)', border: '2px solid #ff6b6b', borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div><div style={{ display: 'inline-block', background: '#ff6b6b', color: 'white', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, padding: '5px 10px', borderRadius: 6, marginBottom: 12 }}>In Progress</div><div style={{ fontSize: 20, fontWeight: 800, color: '#0a0a0a', marginBottom: 4 }}>Data Analytics Track</div><div style={{ fontSize: 14, color: '#71717a' }}>SQL, Python, and visualization</div></div><div style={{ width: 44, height: 44, background: '#0a0a0a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight style={{ width: 18, height: 18, color: 'white' }} /></div></div></div></MockupFrame>} />

        <Step number="02" title="Learn Skills" description="Watch interactive video lessons with real-world examples" reverse mockup={<MockupFrame dark><div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}><div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #ff6b6b, #ff8585)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Users style={{ width: 28, height: 28, color: 'white' }} /></div><div style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Customer Retention</div><div style={{ background: 'rgba(255,255,255,0.06)', padding: '14px 28px', borderRadius: 10, marginBottom: 16 }}><span style={{ color: '#10b981', fontFamily: 'monospace', fontSize: 15, fontWeight: 600 }}>Retention = ((End - New) / Start) × 100</span></div><div style={{ color: '#71717a', fontSize: 14, textAlign: 'center', maxWidth: 260 }}>Keeping existing customers is more valuable than acquiring new ones</div></div></MockupFrame>} />

        <Step number="03" title="AI Tests You" description="The AI tutor checks if you understood the lesson" mockup={<MockupFrame><div style={{ padding: 18, display: 'flex', flexDirection: 'column', minHeight: 340 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, paddingBottom: 16, borderBottom: '1px solid #f4f4f5' }}><div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #ff6b6b, #ff8585)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800 }}>AI</div><div><div style={{ fontSize: 15, fontWeight: 800, color: '#0a0a0a' }}>AI Tutor</div><div style={{ fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 5, height: 5, background: '#10b981', borderRadius: '50%' }} />Online</div></div></div><div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}><div style={{ background: '#f4f4f5', borderRadius: '6px 16px 16px 16px', padding: 16, fontSize: 14, color: '#52525b', lineHeight: 1.6 }}>Quick test: <strong style={{ color: '#0a0a0a' }}>18K subs, 8% churn, $200K budget.</strong> Reduce churn to 5% or acquire 2,400 new?</div><div style={{ background: '#0a0a0a', color: 'white', borderRadius: '16px 16px 6px 16px', padding: 16, fontSize: 14, marginLeft: 'auto', maxWidth: '75%' }}>Retention - 2.7x better ROI</div><div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderRadius: '6px 16px 16px 16px', padding: 16, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}><Check style={{ width: 18, height: 18 }} />Correct! Retention = 2.7x better ROI.</div></div></div></MockupFrame>} />

        <Step number="04" title="Solve Real Challenges" description="Work on actual problems from companies like DoorDash" reverse mockup={<MockupFrame><div style={{ display: 'flex', flexDirection: 'column' }}><div style={{ background: '#0a0a0a', padding: 20 }}><div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><div style={{ width: 26, height: 26, background: '#ff3008', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M23.071 8.409a6.09 6.09 0 0 0-5.396-3.228H.584A.589.589 0 0 0 .17 6.184L3.894 9.93a1.752 1.752 0 0 0 1.242.516h12.049a1.554 1.554 0 1 1 0 3.108H8.235a.59.59 0 0 0-.415 1.003l3.725 3.747a1.75 1.75 0 0 0 1.242.516h4.398a6.098 6.098 0 0 0 5.886-7.411z"/></svg></div><span style={{ color: '#71717a', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 }}>DoorDash Growth Team</span></div><div style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>Northeast Order Decline Analysis</div></div><div style={{ background: '#fafafa', padding: 16 }}><div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>{[{ value: '-12%', label: 'Order Decline' }, { value: '$1.2B', label: 'Revenue at Risk' }, { value: '127K', label: 'Users Churned' }].map((m) => (<div key={m.label} style={{ flex: 1, background: 'white', borderRadius: 10, padding: 12, textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 900, color: '#ff3008' }}>{m.value}</div><div style={{ fontSize: 11, color: '#71717a', marginTop: 4 }}>{m.label}</div></div>))}</div><div style={{ background: 'white', borderRadius: 10, padding: 14 }}><div style={{ fontSize: 10, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Q4 by Region</div><div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 70 }}>{[{ label: 'West', h: 48, green: true, val: '+7%' }, { label: 'Mid', h: 36, green: true, val: '+5%' }, { label: 'South', h: 58, green: true, val: '+9%' }, { label: 'NE', h: 28, green: false, val: '-12%' }].map((bar) => (<div key={bar.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}><div style={{ fontSize: 10, fontWeight: 700, color: bar.green ? '#10b981' : '#dc2626' }}>{bar.val}</div><div style={{ width: 32, height: bar.h, borderRadius: 5, background: bar.green ? 'linear-gradient(180deg, #34d399, #10b981)' : 'linear-gradient(180deg, #ff6b6b, #dc2626)' }} /><div style={{ fontSize: 10, color: '#a1a1aa', fontWeight: 600 }}>{bar.label}</div></div>))}</div></div></div></div></MockupFrame>} />

        <Step number="05" title="Get Ranked" description="AI compares your work against thousands of other students" mockup={<MockupFrame dark><div style={{ padding: 36, minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #ff6b6b, #ff8585)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><Check style={{ width: 36, height: 36, color: 'white' }} /></div><div style={{ background: 'rgba(255,107,107,0.12)', color: '#ff6b6b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, padding: '8px 20px', borderRadius: 100, marginBottom: 18 }}>Challenge Complete</div><div style={{ color: 'white', fontSize: 48, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>Top 10%</div><div style={{ color: '#71717a', fontSize: 15 }}>Beat 90% of all student submissions</div></div></MockupFrame>} />

        <Step number="06" title="Build Your Portfolio" description="All your ranked work in one place for employers to see" reverse mockup={<MockupFrame><div style={{ display: 'flex', flexDirection: 'column' }}><div style={{ padding: 20, borderBottom: '1px solid #f4f4f5' }}><div style={{ fontSize: 20, fontWeight: 800, color: '#0a0a0a' }}>Your Portfolio</div><div style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>Employers see your ranked work</div></div><div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>{[{ logo: '#ff3008', company: 'DoorDash', type: 'Growth Analytics', badge: 'Top 10%', featured: true, isDoorDash: true }, { logo: '#1DB954', letter: 'S', company: 'Spotify', type: 'Product', badge: 'Top 15%' }, { logo: '#635BFF', letter: 'S', company: 'Stripe', type: 'Analytics', badge: 'Top 8%' }, { logo: '#FF5A5F', letter: 'A', company: 'Airbnb', type: 'Pricing', badge: 'Top 12%' }].map((item) => (<div key={item.company} style={{ display: 'flex', alignItems: 'center', gap: 12, background: item.featured ? 'linear-gradient(135deg, rgba(255,107,107,0.06) 0%, rgba(255,107,107,0.02) 100%)' : '#fafafa', borderRadius: 12, padding: 14, border: item.featured ? '1.5px solid rgba(255,107,107,0.3)' : '1px solid transparent' }}><div style={{ width: 40, height: 40, borderRadius: 10, background: item.logo, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 800 }}>{item.isDoorDash ? (<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M23.071 8.409a6.09 6.09 0 0 0-5.396-3.228H.584A.589.589 0 0 0 .17 6.184L3.894 9.93a1.752 1.752 0 0 0 1.242.516h12.049a1.554 1.554 0 1 1 0 3.108H8.235a.59.59 0 0 0-.415 1.003l3.725 3.747a1.75 1.75 0 0 0 1.242.516h4.398a6.098 6.098 0 0 0 5.886-7.411z"/></svg>) : item.letter}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a' }}>{item.company}</div><div style={{ fontSize: 12, color: '#71717a' }}>{item.type}</div></div><div style={{ fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 6, background: 'rgba(255,107,107,0.1)', color: '#ff6b6b' }}>{item.badge}</div></div>))}</div></div></MockupFrame>} />

        <Step number="07" title="Get Hired" description="Companies reach out directly based on your portfolio" mockup={<MockupFrame dark><div style={{ padding: 36, minHeight: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><div style={{ width: 64, height: 64, background: '#ff3008', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M23.071 8.409a6.09 6.09 0 0 0-5.396-3.228H.584A.589.589 0 0 0 .17 6.184L3.894 9.93a1.752 1.752 0 0 0 1.242.516h12.049a1.554 1.554 0 1 1 0 3.108H8.235a.59.59 0 0 0-.415 1.003l3.725 3.747a1.75 1.75 0 0 0 1.242.516h4.398a6.098 6.098 0 0 0 5.886-7.411z"/></svg></div><div style={{ background: 'rgba(255,107,107,0.12)', color: '#ff6b6b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, padding: '8px 20px', borderRadius: 100, marginBottom: 14 }}>Official Offer</div><div style={{ color: 'white', fontSize: 40, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.02em' }}>You're Hired</div><div style={{ color: '#71717a', fontSize: 15, marginBottom: 24 }}>Data Analyst - San Francisco</div><div style={{ display: 'flex', gap: 32 }}><div style={{ textAlign: 'center' }}><div style={{ color: '#52525b', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Base</div><div style={{ color: 'white', fontSize: 26, fontWeight: 800 }}>$125K</div></div><div style={{ textAlign: 'center' }}><div style={{ color: '#52525b', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Bonus</div><div style={{ color: 'white', fontSize: 26, fontWeight: 800 }}>$20K</div></div><div style={{ textAlign: 'center' }}><div style={{ color: '#52525b', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Year 1</div><div style={{ color: '#ff6b6b', fontSize: 32, fontWeight: 900 }}>$165K</div></div></div></div></MockupFrame>} />

        <motion.div ref={ctaRef} initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={ctaInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.8, ease: smooth }} style={{ background: '#0a0a0a', borderRadius: 24, padding: 48, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ position: 'relative', marginBottom: 28 }}><div style={{ color: '#ff6b6b', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Your Path</div><div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>Two ways to succeed</div></motion.div>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, position: 'relative' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '28px 24px', display: 'flex', gap: 16, position: 'relative' }}><div style={{ position: 'absolute', top: -12, left: 20, background: '#10b981', color: 'white', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>1</div><div style={{ width: 44, height: 44, background: '#10b981', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg></div><div><div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 6 }}>Get recruited early</div><div style={{ fontSize: 15, color: '#a1a1aa', lineHeight: 1.5 }}>Employers browse portfolios and reach out. Some get hired before finishing.</div></div></motion.div>
            <motion.div initial={{ opacity: 0 }} animate={ctaInView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.4 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}><span style={{ color: '#52525b', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>OR</span></motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '28px 24px', display: 'flex', gap: 16, position: 'relative' }}><div style={{ position: 'absolute', top: -12, left: 20, background: '#ff6b6b', color: 'white', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>2</div><div style={{ width: 44, height: 44, background: '#ff6b6b', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div><div><div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 6 }}>Complete the APEX Degree</div><div style={{ fontSize: 15, color: '#a1a1aa', lineHeight: 1.5 }}>Finish all challenges and graduate with proof of what you can do.</div></div></motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.6 }} style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}><p style={{ color: '#a1a1aa', fontSize: 16, fontWeight: 500, margin: 0 }}>Either way, you're building real skills and real proof.</p><motion.a href={APPLY_URL} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ff6b6b', color: 'white', fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 100, textDecoration: 'none', cursor: 'pointer' }}>Start now<ArrowRight style={{ width: 16, height: 16 }} /></motion.a></motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function WhatIsApex() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showPauseButton, setShowPauseButton] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);
  const videoInView = useInView(videoContainerRef, { amount: 0.3 });

  useEffect(() => { if (!videoInView && isPlaying && videoRef.current) { videoRef.current.pause(); setIsPlaying(false); setShowPauseButton(true); } }, [videoInView, isPlaying]);
  useEffect(() => { const h = () => { if (document.hidden && isPlaying && videoRef.current) { videoRef.current.pause(); setIsPlaying(false); setShowPauseButton(true); } }; document.addEventListener('visibilitychange', h); return () => document.removeEventListener('visibilitychange', h); }, [isPlaying]);
  useEffect(() => { const v = videoRef.current; if (!v) return; const u = () => { if (v.duration) setProgress((v.currentTime / v.duration) * 100); }; v.addEventListener('timeupdate', u); return () => v.removeEventListener('timeupdate', u); }, []);
  useEffect(() => { let t: NodeJS.Timeout; if (isPlaying && !hasShownPrompt) { t = setTimeout(() => { setShowFullscreenPrompt(true); setHasShownPrompt(true); }, 2000); } return () => clearTimeout(t); }, [isPlaying, hasShownPrompt]);
  useEffect(() => { let t: NodeJS.Timeout; if (showFullscreenPrompt) { t = setTimeout(() => setShowFullscreenPrompt(false), 3000); } return () => clearTimeout(t); }, [showFullscreenPrompt]);

  const handlePlay = () => { if (videoRef.current) { videoRef.current.play(); setIsPlaying(true); setIsEnded(false); setShowPauseButton(false); } };
  const handleVideoClick = () => { if (isPlaying && videoRef.current) { videoRef.current.pause(); setIsPlaying(false); setShowPauseButton(true); } };
  const handleEnded = () => { setIsPlaying(false); setIsEnded(true); setProgress(100); };
  const handleReplay = () => { if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play(); setIsPlaying(true); setIsEnded(false); setShowPauseButton(false); } };
  const toggleMute = (e: React.MouseEvent) => { e.stopPropagation(); if (videoRef.current) { videoRef.current.muted = !videoRef.current.muted; setIsMuted(!isMuted); } };
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); const p = (e.clientX - r.left) / r.width; if (videoRef.current?.duration) { videoRef.current.currentTime = p * videoRef.current.duration; setProgress(p * 100); } };
  const goFullscreen = (e: React.MouseEvent) => { e.stopPropagation(); const v = videoRef.current; if (v) { if (v.requestFullscreen) v.requestFullscreen(); else if ((v as any).webkitRequestFullscreen) (v as any).webkitRequestFullscreen(); else if ((v as any).msRequestFullscreen) (v as any).msRequestFullscreen(); } setShowFullscreenPrompt(false); };

  return (
    <section id="what" ref={sectionRef} style={{ padding: '96px 0', background: 'white', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInUp} custom={0} style={{ textAlign: 'center', marginBottom: 48 }}><span style={{ color: '#ff6b6b', fontSize: 14, fontWeight: 500 }}>What is APEX?</span><h2 style={{ marginTop: 12, fontSize: 32, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>A new way to prove<br />what you can do</h2></motion.div>
        <div ref={videoContainerRef} style={{ margin: '0 auto 72px', maxWidth: 1100, lineHeight: 0, fontSize: 0 }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} style={{ position: 'relative', lineHeight: 0, fontSize: 0, overflow: 'hidden' }}>
            <video ref={videoRef} style={{ width: '100%', display: 'block', verticalAlign: 'top' }} src="/APEX-Product-Video.mp4" playsInline onEnded={handleEnded} onClick={handleVideoClick} />
            <AnimatePresence>{showFullscreenPrompt && isPlaying && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'absolute', top: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 20, pointerEvents: 'none' }}><motion.button onClick={goFullscreen} animate={{ y: [0, -3, 0] }} transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg, rgba(255,107,107,0.95) 0%, rgba(255,80,80,0.95) 100%)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 16, padding: '16px 28px', cursor: 'pointer', boxShadow: '0 10px 40px rgba(255,107,107,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset' }}><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></motion.div><span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>Watch in Full Quality</span></motion.button></motion.div>)}</AnimatePresence>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '24px 16px 12px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: isPlaying ? 0.3 : 1, transition: 'opacity 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = isPlaying ? '0.3' : '1'}><div onClick={handleProgressClick} style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2, cursor: 'pointer' }}><div style={{ width: `${progress}%`, height: '100%', background: '#ff6b6b', borderRadius: 2, transition: 'width 0.1s linear' }} /></div><button onClick={toggleMute} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{isMuted ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>}</button><button onClick={goFullscreen} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></button></div>
            <AnimatePresence>{!isPlaying && !isEnded && !showPauseButton && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handlePlay} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} /><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ position: 'relative', zIndex: 10, width: 80, height: 80, background: '#ff6b6b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play style={{ width: 32, height: 32, color: 'white', marginLeft: 4 }} fill="white" /></motion.div></motion.div>)}</AnimatePresence>
            <AnimatePresence>{showPauseButton && !isEnded && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handlePlay} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} /><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ position: 'relative', zIndex: 10, width: 80, height: 80, background: '#ff6b6b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play style={{ width: 32, height: 32, color: 'white', marginLeft: 4 }} fill="white" /></motion.div></motion.div>)}</AnimatePresence>
            <AnimatePresence>{isEnded && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleReplay} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} /><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}><div style={{ width: 80, height: 80, background: '#ff6b6b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RotateCcw style={{ width: 32, height: 32, color: 'white' }} /></div><span style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>Watch again</span></motion.div></motion.div>)}</AnimatePresence>
          </motion.div>
        </div>
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInUp} custom={0.3} style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}><span style={{ color: '#ff6b6b', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>The credential</span><h3 style={{ marginTop: 12, fontSize: 28, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>Earn the APEX Degree</h3><p style={{ marginTop: 20, color: '#52525b', fontSize: 17, lineHeight: 1.7 }}>The APEX degree is a portfolio of verified work that commands respect. When employers see APEX on your resume, they know you've mastered real-world challenges and defended your expertise live.</p></motion.div>
      </div>
    </section>
  );
}

function Tracks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const tracks = [{ name: 'Data Analytics', desc: 'SQL, Python, visualization', unlocked: true, Icon: BarChart3 }, { name: 'Product Management', desc: 'Strategy, metrics, roadmaps', unlocked: false, Icon: Rocket }, { name: 'Software Engineering', desc: 'Full-stack development', unlocked: false, Icon: Code }, { name: 'UX Design', desc: 'Research, prototyping, systems', unlocked: false, Icon: Palette }, { name: 'Marketing', desc: 'Growth, analytics, campaigns', unlocked: false, Icon: TrendingUp }, { name: 'Finance', desc: 'Modeling, analysis, valuation', unlocked: false, Icon: DollarSign }];

  return (
    <section ref={ref} style={{ padding: '120px 0', background: '#0a0a0a', overflow: 'hidden', position: 'relative' }}>
      <motion.div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1000, height: 600, background: 'radial-gradient(ellipse, rgba(255,107,107,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: smooth }} style={{ textAlign: 'center', marginBottom: 56 }}><motion.span initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ color: '#ff6b6b', fontSize: 13, fontWeight: 600 }}>Career Tracks</motion.span><motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }} style={{ marginTop: 12, fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>Choose your path</motion.h2><motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.35 }} style={{ marginTop: 12, color: '#71717a', fontSize: 16 }}>Start with Data Analytics today. More tracks launching soon.</motion.p></motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>{tracks.map((track, i) => (<motion.div key={track.name} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: smooth, delay: 0.2 + i * 0.08 }} whileHover={track.unlocked ? { y: -4, scale: 1.01 } : {}} style={{ position: 'relative', background: track.unlocked ? 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(20,20,23,1) 100%)' : '#111113', borderRadius: 18, padding: 24, border: track.unlocked ? '1px solid rgba(255,107,107,0.3)' : '1px solid #1f1f23', cursor: track.unlocked ? 'pointer' : 'default', transition: 'all 0.3s ease' }}><div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}><div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: track.unlocked ? 'linear-gradient(135deg, #ff6b6b, #ff5252)' : '#1f1f23', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><track.Icon style={{ width: 22, height: 22, color: track.unlocked ? 'white' : '#52525b' }} /></div><div><h3 style={{ fontSize: 18, fontWeight: 700, color: track.unlocked ? 'white' : '#52525b', marginBottom: 4 }}>{track.name}</h3><p style={{ fontSize: 14, color: track.unlocked ? '#a1a1aa' : '#3f3f46' }}>{track.desc}</p></div></div>{track.unlocked ? <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#ff6b6b', color: 'white', fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.05em' }}><motion.div style={{ width: 5, height: 5, background: 'white', borderRadius: '50%' }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />Open</div> : <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: '1px solid #27272a', color: '#52525b', fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 100 }}><Lock style={{ width: 11, height: 11 }} />Soon</div>}</div>{track.unlocked && <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }} style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.1)' }}><motion.a href={APPLY_URL} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#ff6b6b', fontSize: 14, fontWeight: 600, textDecoration: 'none' }} whileHover={{ x: 4 }}>Start this track<ArrowRight style={{ width: 14, height: 14 }} /></motion.a></motion.div>}</motion.div>))}</div>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.8 }} style={{ marginTop: 40, textAlign: 'center', color: '#52525b', fontSize: 13 }}>More tracks launching throughout 2026</motion.p>
      </div>
    </section>
  );
}

function Comparison() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ padding: '120px 0', background: 'white' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInUp} custom={0} style={{ textAlign: 'center', marginBottom: 64 }}><h2 style={{ fontSize: 36, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>Why APEX is different</h2></motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 860, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, ease: smooth, delay: 0.2 }} whileHover={{ y: -5 }} style={{ background: '#f4f4f5', borderRadius: 20, padding: 36 }}><p style={{ color: '#a1a1aa', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Traditional degree</p><div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 28 }}>{[{ label: "Cost", value: "$100k – $200k" }, { label: "Time", value: "4 years" }, { label: "Format", value: "Lectures & exams" }, { label: "What you get", value: "A transcript" }].map((item) => (<div key={item.label}><p style={{ color: '#a1a1aa', fontSize: 13 }}>{item.label}</p><p style={{ fontSize: 22, fontWeight: 600, color: '#a1a1aa', marginTop: 4 }}>{item.value}</p></div>))}</div></motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, ease: smooth, delay: 0.3 }} whileHover={{ y: -5, scale: 1.02 }} style={{ background: '#0a0a0a', borderRadius: 20, padding: 36, position: 'relative', overflow: 'hidden' }}><motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }} animate={{ x: ['-200%', '200%'] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} /><p style={{ color: '#ff6b6b', fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', position: 'relative' }}>APEX degree</p><div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 28, position: 'relative' }}>{[{ label: "Cost", value: PRICE }, { label: "Time", value: "2 years" }, { label: "Format", value: "Real challenges" }, { label: "What you get", value: "A portfolio" }].map((item) => (<div key={item.label}><p style={{ color: '#71717a', fontSize: 13 }}>{item.label}</p><p style={{ fontSize: 22, fontWeight: 600, color: 'white', marginTop: 4 }}>{item.value}</p></div>))}</div></motion.div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="pricing" ref={ref} style={{ padding: '120px 0', background: '#fafafa' }}>
      <div style={{ maxWidth: 460, margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInUp} custom={0} style={{ textAlign: 'center' }}><h2 style={{ fontSize: 44, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.03em' }}>{PRICE}</h2><p style={{ marginTop: 8, color: '#71717a', fontSize: 15 }}>Invest in your future. 24 months. Everything included.</p></motion.div>
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInUp} custom={0.15} whileHover={{ y: -5 }} style={{ marginTop: 40, background: 'white', borderRadius: 20, padding: 28, border: '1px solid #e5e5e5' }}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>{["AI tutor", "All challenges", "Rubric feedback", "Office hours", "Live defenses", "APEX degree"].map((item) => (<div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check style={{ width: 15, height: 15, color: '#ff6b6b' }} /><span style={{ fontSize: 13, color: '#52525b' }}>{item}</span></div>))}</div><motion.a href={APPLY_URL} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ marginTop: 28, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#0a0a0a', color: 'white', fontSize: 14, fontWeight: 500, padding: '14px 24px', borderRadius: 100, textDecoration: 'none' }}>Apply Now<ArrowRight style={{ width: 15, height: 15 }} /></motion.a><p style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: '#a1a1aa' }}>Limited spots available. Applications reviewed weekly.</p></motion.div>
      </div>
    </section>
  );
}

function Employers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const candidates = [{ name: 'Sarah Chen', rank: 'Top 5%', score: 94, initials: 'SC', color: '#ff6b6b', projects: 12, skills: ['SQL', 'Python', 'Tableau', 'dbt'], companies: ['DoorDash', 'Stripe', 'Airbnb'], highlight: 'Built a churn prediction model that identified $2.3M in at-risk revenue' }, { name: 'Marcus Johnson', rank: 'Top 8%', score: 91, initials: 'MJ', color: '#667eea', projects: 10, skills: ['Python', 'R', 'PowerBI', 'SQL'], companies: ['Spotify', 'Netflix', 'Uber'], highlight: 'Designed A/B testing framework that improved conversion by 34%' }];

  return (
    <section ref={ref} style={{ padding: '120px 0', background: '#0a0a0a', overflow: 'hidden', position: 'relative' }}>
      <motion.div style={{ position: 'absolute', top: 0, right: 0, width: 700, height: 700, opacity: 0.15, background: 'radial-gradient(circle at 70% 30%, rgba(255,107,107,0.4) 0%, transparent 50%)', pointerEvents: 'none' }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: smooth }} style={{ textAlign: 'center', marginBottom: 64 }}><motion.span initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.1 }} style={{ color: '#ff6b6b', fontSize: 13, fontWeight: 600 }}>For Employers</motion.span><motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }} style={{ marginTop: 12, fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>See the work before you hire</motion.h2><motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.35 }} style={{ marginTop: 16, color: '#71717a', fontSize: 16, maxWidth: 500, margin: '16px auto 0' }}>Browse verified portfolios. Hire with confidence.</motion.p></motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>{candidates.map((c, i) => (<motion.div key={c.name} initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.7, delay: 0.4 + i * 0.15, ease: smooth }} whileHover={{ y: -8, scale: 1.02 }} style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)', borderRadius: 24, padding: 32, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}><motion.div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle, ${c.color}20 0%, transparent 70%)`, pointerEvents: 'none' }} animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} /><div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, position: 'relative' }}><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><motion.div whileHover={{ scale: 1.1, rotate: 5 }} style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${c.color}, ${c.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 700, boxShadow: `0 8px 24px ${c.color}40` }}>{c.initials}</motion.div><div><div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>{c.name}</div><div style={{ fontSize: 14, color: '#71717a', marginTop: 2 }}>{c.projects} verified projects</div></div></div><motion.div initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.6 + i * 0.15, type: "spring" }} style={{ background: c.color, color: 'white', fontSize: 14, fontWeight: 700, padding: '8px 16px', borderRadius: 100 }}>{c.rank}</motion.div></div><motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.7 + i * 0.15 }} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, marginBottom: 24 }}><p style={{ color: '#d4d4d8', fontSize: 15, lineHeight: 1.5, margin: 0 }}>"{c.highlight}"</p></motion.div><div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Skills</div><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{c.skills.map((s, j) => (<motion.span key={s} initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.8 + i * 0.15 + j * 0.05 }} style={{ background: 'rgba(255,255,255,0.1)', color: '#a1a1aa', fontSize: 13, fontWeight: 500, padding: '6px 12px', borderRadius: 8 }}>{s}</motion.span>))}</div></div><div><div style={{ fontSize: 11, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Challenge Companies</div><div style={{ display: 'flex', gap: 8 }}>{c.companies.map((co, j) => (<motion.span key={co} initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.9 + i * 0.15 + j * 0.05 }} style={{ background: `${c.color}15`, color: c.color, fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 6 }}>{co}</motion.span>))}</div></div><motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 1 + i * 0.15 }} style={{ position: 'absolute', bottom: 24, right: 24, display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: '#52525b', fontSize: 13 }}>Score</span><span style={{ color: 'white', fontSize: 24, fontWeight: 800 }}>{c.score}</span></motion.div></motion.div>))}</div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 1.2 }} style={{ marginTop: 48, textAlign: 'center' }}><motion.a href="#" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ff6b6b', color: 'white', fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 100, textDecoration: 'none' }}>Browse 847 candidates<ArrowRight style={{ width: 16, height: 16 }} /></motion.a></motion.div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const faqs = [{ q: "Is the APEX degree accredited?", a: "APEX is a new kind of credential built on proof of work. Employers can see exactly what you're capable of through your portfolio." }, { q: "Can I use AI tools?", a: "Yes. Use whatever tools help you do great work. But you defend everything in a live session—if you can't explain your approach, you don't pass." }, { q: "What's the time commitment?", a: "Plan for 10-15 hours per week over 2 years. You'll have structured milestones, but flexibility in how you get there." }, { q: "What do employers see when I graduate?", a: "Everything. Your code, dashboards, written memos, recordings of your live defenses, and your rubric scores." }, { q: "What if I already have a degree?", a: "Many students will. APEX isn't about replacing what you have—it's about proving what you can do." }];
  return (
    <section ref={ref} style={{ padding: '120px 0', background: 'white' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
        <motion.h2 initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeIn} style={{ fontSize: 13, fontWeight: 500, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 36 }}>Frequently asked questions</motion.h2>
        <div>{faqs.map((faq, i) => (<div key={faq.q} style={{ borderBottom: '1px solid #f4f4f5' }}><motion.button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }} whileHover={{ x: 3 }}><span style={{ fontSize: 16, fontWeight: 500, color: '#0a0a0a' }}>{faq.q}</span><motion.span animate={{ rotate: open === i ? 45 : 0 }} style={{ color: '#a1a1aa', fontSize: 22, fontWeight: 300 }}>+</motion.span></motion.button><AnimatePresence>{open === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}><p style={{ paddingBottom: 22, color: '#71717a', lineHeight: 1.7, fontSize: 15 }}>{faq.a}</p></motion.div>)}</AnimatePresence></div>))}</div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: '28px 0', background: '#fafafa', borderTop: '1px solid #e5e5e5' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0a0a0a' }}><Image src="/APEX-Final-Black.svg?v=100" alt="APEX" width={24} height={24} style={{ height: 24, width: 24 }} unoptimized /><span style={{ fontSize: 13, fontWeight: 500 }}>{BRAND}</span></div><div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#a1a1aa' }}><a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy</a><a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Terms</a></div></div>
        <div style={{ paddingTop: 16, borderTop: '1px solid #e5e5e5' }}><p style={{ fontSize: 11, color: '#a1a1aa', textAlign: 'center', lineHeight: 1.6 }}>APEX is not currently partnered with or affiliated with any of the companies mentioned above. Company names and logos are used for illustrative purposes only to demonstrate the types of real-world challenges students may encounter.</p></div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');*{font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}body{margin:0;padding:0}::selection{background:rgba(255,107,107,0.2)}a{text-decoration:none}`}</style>
      <main style={{ minHeight: '100vh' }}><Hero /><Journey /><WhatIsApex /><Tracks /><Comparison /><Pricing /><Employers /><FAQ /><Footer /></main>
    </>
  );
}