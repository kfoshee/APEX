"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, BookOpen, Users, Target, Briefcase, MessageSquare, Video, Clock, Trophy, Brain, Code, FileText, Play, Flame, Sparkles, Timer, Pause, Volume2, Mic, VideoIcon, Monitor, Calendar, MessageCircle, Hand, Download, Smartphone, BarChart2, Award, DollarSign, TrendingUp, Shield, Zap, CheckCircle, Star, Eye, Send, Wifi, ChevronDown, Bell, Home, User, Share2, Lock, Activity, RefreshCw, Layers, Search, Settings, ChevronRight, MapPin, Building, ThumbsUp, AlertCircle, Lightbulb, GitBranch, PenTool, HeartHandshake, Battery, Signal, Coffee, Headphones, FileCheck, GraduationCap, Rocket, Heart, HelpCircle, CalendarDays, ClipboardList, Wallet, Globe, Linkedin, Mail, Database, LineChart, BarChart, PieChart, Presentation, MessageSquareText, UserCheck, Verified, BadgeCheck, ChevronUp, Grid, Table, Filter, Upload, FolderOpen, Terminal, PlayCircle, PauseCircle, SkipForward, ArrowUpRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const smooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

function useScrollSave() {
  const router = useRouter();
  
  // Use this for navigation where you want to save scroll position (e.g., Apply buttons)
  const navigateWithScroll = (url: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      sessionStorage.setItem('scrollSource', '/learn-more');
    }
    router.push(url);
  };
  
  // Always scroll to top when landing on learn-more page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);
  
  return navigateWithScroll;
}

// Confetti - only renders when active
function Confetti({ active }: { active: boolean }) {
  const colors = ['#ff6b6b', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6', '#ec4899', '#06b6d4'];
  const confetti = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 3 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 8 + Math.random() * 12,
    rotation: Math.random() * 360,
  }));
  
  if (!active) return null;
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', pointerEvents: 'none', zIndex: 50 }}>
      {confetti.map((c) => (
        <motion.div
          key={c.id}
          initial={{ y: -50, x: `${c.x}vw`, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', rotate: c.rotation + 720, opacity: [1, 1, 1, 0] }}
          transition={{ duration: c.duration, delay: c.delay, ease: "linear" }}
          style={{
            position: 'absolute',
            width: c.size,
            height: c.size * 0.6,
            background: c.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

// Unified App Chrome
function AppChrome({ children, streak = 12, compact = false }: { children: React.ReactNode, streak?: number, compact?: boolean }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: smooth }}
      style={{ background: '#111113', borderRadius: compact ? 16 : (isMobile ? 16 : 20), overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 30px 60px -15px rgba(0,0,0,0.5)' }}
    >
      <div style={{ background: '#0a0a0b', padding: compact ? '8px 12px' : (isMobile ? '8px 12px' : '10px 14px'), display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: isMobile ? 4 : 5 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div key={i} style={{ width: compact ? 8 : (isMobile ? 8 : 10), height: compact ? 8 : (isMobile ? 8 : 10), borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 5, padding: compact ? '4px 10px' : (isMobile ? '4px 8px' : '5px 12px'), marginLeft: 8 }}>
          <span style={{ color: '#52525b', fontSize: compact ? 10 : (isMobile ? 9 : 11) }}>apex.degree</span>
        </div>
      </div>
      <div style={{ background: '#0a0a0b', padding: compact ? '8px 14px' : (isMobile ? '8px 12px' : '10px 16px'), display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 8 }}>
          <div style={{ width: compact ? 22 : (isMobile ? 20 : 26), height: compact ? 22 : (isMobile ? 20 : 26), background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: compact ? 10 : (isMobile ? 9 : 12), fontWeight: 800 }}>A</span>
          </div>
          <span style={{ color: 'white', fontSize: compact ? 12 : (isMobile ? 11 : 13), fontWeight: 600 }}>APEX</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Flame style={{ width: compact ? 13 : (isMobile ? 12 : 15), height: compact ? 13 : (isMobile ? 12 : 15), color: '#f59e0b' }} />
            <span style={{ color: '#f59e0b', fontSize: compact ? 11 : (isMobile ? 10 : 12), fontWeight: 700 }}>{streak}</span>
          </div>
          <div style={{ width: compact ? 24 : (isMobile ? 22 : 28), height: compact ? 24 : (isMobile ? 22 : 28), background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: compact ? 9 : (isMobile ? 8 : 10), fontWeight: 700 }}>AJ</span>
          </div>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function Nav() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigateWithScroll = useScrollSave();
  const router = useRouter();
  
  const handleBackToHome = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollPosition', '0');
      sessionStorage.setItem('scrollSource', '/');
    }
    router.push('/');
  };
  
  return (
    <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: isMobile ? '12px 16px' : '14px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.button onClick={handleBackToHome} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', background: 'none', border: 'none', cursor: 'pointer' }} whileHover={{ x: -3 }} whileTap={{ scale: 0.98 }}>
          <ArrowLeft style={{ width: 16, height: 16, color: '#52525b' }} />
          <Image src="/APEX-Final-White.svg?v=100" alt="APEX" width={20} height={20} style={{ height: 20, width: 20 }} priority unoptimized />
          <span style={{ fontSize: 13, fontWeight: 500 }}>APEX</span>
        </motion.button>
        <motion.button onClick={() => navigateWithScroll('/apply')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)', color: 'white', fontSize: isMobile ? 12 : 13, fontWeight: 600, padding: isMobile ? '8px 16px' : '10px 20px', borderRadius: 100, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px -5px rgba(255,107,107,0.5)' }}>Apply Now</motion.button>
      </div>
    </motion.nav>
  );
}

function Hero() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const navigateWithScroll = useScrollSave();
  
  return (
    <section style={{ background: '#0a0a0a', padding: isMobile ? '40px 20px 60px' : '60px 24px 90px', position: 'relative', overflow: 'hidden' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', width: isMobile ? 400 : 800, height: isMobile ? 400 : 800, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: 'conic-gradient(from 0deg, transparent, rgba(255,107,107,0.03), transparent, rgba(139,92,246,0.03), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: 650, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 32 : (isTablet ? 48 : 60), fontWeight: 800, color: 'white', lineHeight: 1.05, marginBottom: 20, letterSpacing: '-0.03em' }}>
          From zero to <motion.span animate={{ color: ['#ff6b6b', '#f59e0b', '#ff6b6b'] }} transition={{ duration: 4, repeat: Infinity }}>hired</motion.span><br />in 24 months
        </motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ color: '#a1a1aa', fontSize: isMobile ? 16 : 18, marginBottom: 32, lineHeight: 1.6 }}>
          See exactly how it works
        </motion.p>
        
        <motion.button onClick={() => navigateWithScroll('/apply')} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)', color: 'white', fontSize: isMobile ? 14 : 16, fontWeight: 600, padding: isMobile ? '14px 28px' : '16px 32px', borderRadius: 100, border: 'none', cursor: 'pointer', boxShadow: '0 8px 30px -5px rgba(255,107,107,0.5)' }}>
          Start Your Journey <ArrowRight style={{ width: isMobile ? 16 : 18, height: isMobile ? 16 : 18, marginLeft: 8, display: 'inline', verticalAlign: 'middle' }} />
        </motion.button>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 48 }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown style={{ width: 28, height: 28, color: '#3f3f46' }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 1: Journey Visual
function JourneySection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const phases = [
    { month: '1-6', title: 'Learn', icon: BookOpen, color: '#10b981' },
    { month: '7-18', title: 'Build', icon: Code, color: '#3b82f6' },
    { month: '19-24', title: 'Launch', icon: Rocket, color: '#ff6b6b' },
  ];
  
  return (
    <section ref={ref} style={{ background: '#fafafa', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: '#0a0a0a', textAlign: 'center', marginBottom: isMobile ? 40 : 60 }}>24 months, 3 phases</motion.h2>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 0 }}>
          {!isMobile && (
            <div style={{ position: 'absolute', top: 50, left: '15%', right: '15%', height: 4, background: '#e5e5e5', zIndex: 0 }}>
              <motion.div initial={{ width: 0 }} animate={isInView ? { width: '100%' } : {}} transition={{ duration: 1.5, ease: smooth }} style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6, #ff6b6b)' }} />
            </div>
          )}
          
          {phases.map((phase, i) => (
            <motion.div 
              key={phase.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
              style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', position: 'relative', zIndex: 1, flex: isMobile ? 'none' : 1, gap: isMobile ? 20 : 0, width: isMobile ? '100%' : 'auto' }}
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                style={{ width: isMobile ? 70 : 100, height: isMobile ? 70 : 100, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', border: `4px solid ${phase.color}`, flexShrink: 0 }}
              >
                <phase.icon style={{ width: isMobile ? 28 : 40, height: isMobile ? 28 : 40, color: phase.color }} />
              </motion.div>
              <div style={{ textAlign: isMobile ? 'left' : 'center', marginTop: isMobile ? 0 : 20 }}>
                <span style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: '#0a0a0a', display: 'block' }}>{phase.title}</span>
                <span style={{ fontSize: isMobile ? 13 : 14, color: phase.color, fontWeight: 600, marginTop: 4, display: 'block' }}>Months {phase.month}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// SECTION 2: Dashboard Mockup
function DashboardSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section ref={ref} style={{ background: '#0a0a0a', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 16 }}>Your personal dashboard</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} style={{ color: '#71717a', fontSize: isMobile ? 15 : 17, textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>Track everything in one place</motion.p>
        
        <AppChrome>
          <div style={{ padding: isMobile ? 16 : 24 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }}>
              <h3 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: 'white', marginBottom: 4 }}>Welcome back, Alex</h3>
              <p style={{ color: '#71717a', fontSize: isMobile ? 13 : 14 }}>Keep the momentum going</p>
            </motion.div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? 10 : 12, marginTop: 20, marginBottom: 24 }}>
              {[
                { label: 'Completed', value: '47/200', icon: BookOpen, color: '#10b981' },
                { label: 'Rank', value: 'Top 15%', icon: Trophy, color: '#ff6b6b' },
                { label: 'Challenges', value: '8/50', icon: Target, color: '#8b5cf6' },
                { label: 'Streak', value: '12 days', icon: Flame, color: '#f59e0b' },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 + i * 0.1 }} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? 12 : 14, padding: isMobile ? 12 : 16, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <stat.icon style={{ width: isMobile ? 16 : 18, height: isMobile ? 16 : 18, color: stat.color, marginBottom: isMobile ? 8 : 10 }} />
                  <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: 'white' }}>{stat.value}</div>
                  <div style={{ fontSize: isMobile ? 11 : 12, color: '#52525b', marginTop: 2 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }} style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(255,107,107,0.02) 100%)', border: '1px solid rgba(255,107,107,0.15)', borderRadius: 16, padding: isMobile ? 16 : 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <span style={{ background: '#ff6b6b', color: 'white', fontSize: isMobile ? 9 : 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>CONTINUE</span>
                  <h4 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: 'white', marginTop: 10 }}>SQL Fundamentals</h4>
                  <p style={{ fontSize: isMobile ? 12 : 13, color: '#71717a', marginTop: 4 }}>Module 3: Advanced JOINs</p>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ff6b6b', color: 'white', fontSize: isMobile ? 13 : 14, fontWeight: 600, padding: isMobile ? '10px 20px' : '12px 24px', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
                  <Play style={{ width: 14, height: 14 }} fill="white" /> Resume
                </motion.button>
              </div>
            </motion.div>
          </div>
        </AppChrome>
      </div>
    </section>
  );
}

// SECTION 3: Video Lesson with Quiz
function VideoSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [showQuiz, setShowQuiz] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowQuiz(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);
  
  return (
    <section ref={ref} style={{ background: '#fafafa', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: '#0a0a0a', textAlign: 'center', marginBottom: 16 }}>Lessons that actually engage</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} style={{ color: '#71717a', fontSize: isMobile ? 15 : 17, textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>Auto-pause checkpoints verify you understood</motion.p>
        
        <AppChrome>
          <div style={{ position: 'relative', aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 16 : 0 }}>
              <motion.div initial={{ scale: 0 }} animate={isInView ? { scale: 1, y: [0, -10, 0] } : {}} transition={{ scale: { delay: 0.3 }, y: { duration: 4, repeat: Infinity } }} style={{ width: isMobile ? 60 : 80, height: isMobile ? 60 : 80, background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)', borderRadius: isMobile ? 16 : 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? 16 : 24, boxShadow: '0 20px 40px -10px rgba(255,107,107,0.4)' }}>
                <TrendingUp style={{ width: isMobile ? 28 : 40, height: isMobile ? 28 : 40, color: 'white' }} />
              </motion.div>
              <h3 style={{ color: 'white', fontSize: isMobile ? 18 : 28, fontWeight: 700, marginBottom: isMobile ? 12 : 16 }}>Customer Retention</h3>
              <code style={{ background: 'rgba(255,255,255,0.05)', padding: isMobile ? '10px 16px' : '14px 28px', borderRadius: isMobile ? 10 : 14, color: '#10b981', fontSize: isMobile ? 12 : 20, fontFamily: 'monospace' }}>Retention = ((End - New) / Start) x 100</code>
            </div>
            
            <AnimatePresence>
              {showQuiz && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                  <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ background: '#18181b', borderRadius: isMobile ? 20 : 24, padding: isMobile ? 20 : 36, maxWidth: 450, width: '100%', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,107,107,0.1)', padding: '8px 16px', borderRadius: 100, marginBottom: isMobile ? 16 : 24 }}>
                      <Pause style={{ width: 16, height: 16, color: '#ff6b6b' }} />
                      <span style={{ color: '#ff6b6b', fontSize: 13, fontWeight: 600 }}>Quick Check</span>
                    </div>
                    <h4 style={{ color: 'white', fontSize: isMobile ? 14 : 20, fontWeight: 600, marginBottom: isMobile ? 20 : 28, lineHeight: 1.5 }}>1,000 users start, 900 end, 150 new.<br />What is the retention rate?</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? 8 : 12 }}>
                      {['75%', '90%', '85%', '80%'].map((a) => (
                        <motion.button key={a} whileHover={{ scale: 1.03, background: 'rgba(255,107,107,0.1)' }} whileTap={{ scale: 0.98 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: isMobile ? 10 : 14, padding: isMobile ? '12px' : '16px', color: 'white', fontSize: isMobile ? 16 : 18, fontWeight: 600, cursor: 'pointer' }}>{a}</motion.button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: isMobile ? '16px 12px 12px' : '24px 20px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14 }}>
                <Pause style={{ width: isMobile ? 16 : 18, height: isMobile ? 16 : 18, color: 'white' }} />
                <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 3 }}>
                  <motion.div initial={{ width: 0 }} animate={isInView ? { width: '45%' } : {}} transition={{ duration: 2 }} style={{ height: '100%', background: '#ff6b6b', borderRadius: 3 }} />
                </div>
                <span style={{ color: 'white', fontSize: isMobile ? 11 : 13 }}>5:42 / 12:30</span>
              </div>
            </div>
          </div>
        </AppChrome>
      </div>
    </section>
  );
}

// SECTION 4: AI Tutor Chat
function AITutorSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [msgIndex, setMsgIndex] = useState(0);
  
  const messages = [
    { from: 'user', text: "My JOIN returns duplicates. Help?" },
    { from: 'ai', text: "What relationship do your tables have - one-to-one, one-to-many, or many-to-many?" },
    { from: 'user', text: "One-to-many. Customers to orders." },
    { from: 'ai', text: "If a customer has 3 orders, how many times will they appear in your results?" },
  ];
  
  useEffect(() => {
    if (isInView && msgIndex < messages.length) {
      const timer = setTimeout(() => setMsgIndex(i => i + 1), 1400);
      return () => clearTimeout(timer);
    }
  }, [isInView, msgIndex, messages.length]);
  
  return (
    <section ref={ref} style={{ background: '#0a0a0a', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 16 }}>24/7 AI tutor</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} style={{ color: '#71717a', fontSize: isMobile ? 15 : 17, textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>Guides you with questions, never just gives answers</motion.p>
        
        <AppChrome compact>
          <div style={{ padding: isMobile ? '12px 14px' : '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: isMobile ? 36 : 42, height: isMobile ? 36 : 42, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain style={{ width: isMobile ? 18 : 22, height: isMobile ? 18 : 22, color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: 'white' }}>APEX AI Tutor</div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: '#10b981' }}>Always available</div>
            </div>
          </div>
          
          <div style={{ padding: isMobile ? 14 : 18, minHeight: isMobile ? 240 : 300, display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 14 }}>
            {messages.slice(0, msgIndex).map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '85%', alignSelf: m.from === 'user' ? 'flex-start' : 'flex-end' }}>
                <div style={{ background: m.from === 'user' ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', border: m.from === 'ai' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.05)', borderRadius: m.from === 'user' ? '4px 16px 16px 16px' : '16px 16px 4px 16px', padding: isMobile ? '12px 14px' : '14px 18px' }}>
                  <p style={{ fontSize: isMobile ? 13 : 15, color: 'white', margin: 0, lineHeight: 1.5 }}>{m.text}</p>
                </div>
              </motion.div>
            ))}
            {msgIndex < messages.length && isInView && (
              <div style={{ alignSelf: msgIndex % 2 === 0 ? 'flex-start' : 'flex-end', padding: '10px 14px' }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[0, 1, 2].map(j => <motion.div key={j} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }} style={{ width: 7, height: 7, background: '#52525b', borderRadius: '50%' }} />)}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ padding: isMobile ? '12px 14px' : '14px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: isMobile ? 10 : 12 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: isMobile ? '12px 14px' : '14px 18px', fontSize: isMobile ? 13 : 14, color: '#52525b' }}>Ask anything...</div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 14, width: isMobile ? 44 : 48, height: isMobile ? 44 : 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Send style={{ width: isMobile ? 18 : 20, height: isMobile ? 18 : 20, color: 'white' }} />
            </motion.button>
          </div>
        </AppChrome>
      </div>
    </section>
  );
}

// SECTION 5: Study Group Video Call
function PeerSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const peers = [
    { name: 'Sarah', color: '#10b981', speaking: true },
    { name: 'Marcus', color: '#8b5cf6', speaking: false },
    { name: 'Emily', color: '#f59e0b', speaking: false },
    { name: 'David', color: '#3b82f6', speaking: false },
  ];
  
  return (
    <section ref={ref} style={{ background: '#fafafa', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: '#0a0a0a', textAlign: 'center', marginBottom: 16 }}>5 peers at your level</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} style={{ color: '#71717a', fontSize: isMobile ? 15 : 17, textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>Group chat + optional weekly calls</motion.p>
        
        <AppChrome>
          <div style={{ padding: isMobile ? '12px 14px' : '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <motion.div animate={isInView ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 10, height: 10, background: '#10b981', borderRadius: '50%' }} />
              <span style={{ color: 'white', fontSize: isMobile ? 14 : 15, fontWeight: 600 }}>Study Call</span>
            </div>
            <span style={{ color: '#71717a', fontSize: isMobile ? 13 : 14 }}>47:23</span>
          </div>
          
          <div style={{ padding: isMobile ? 12 : 18, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? 10 : 14 }}>
            {peers.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.3 + i * 0.1 }} style={{ aspectRatio: '4/3', background: `${p.color}10`, borderRadius: isMobile ? 14 : 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: p.speaking ? `3px solid ${p.color}` : '3px solid transparent', position: 'relative' }}>
                <motion.div animate={p.speaking && isInView ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 0.6, repeat: Infinity }} style={{ width: isMobile ? 44 : 60, height: isMobile ? 44 : 60, background: `linear-gradient(135deg, ${p.color}, ${p.color}dd)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: isMobile ? 16 : 20, fontWeight: 700, marginBottom: isMobile ? 6 : 10 }}>{p.name[0]}</motion.div>
                <span style={{ color: 'white', fontSize: isMobile ? 12 : 14, fontWeight: 500 }}>{p.name}</span>
                {p.speaking && (
                  <div style={{ position: 'absolute', bottom: isMobile ? 8 : 12, left: isMobile ? 10 : 14, display: 'flex', gap: 3 }}>
                    {[0, 1, 2, 3].map(j => <motion.div key={j} animate={isInView ? { height: [4, 16, 4] } : {}} transition={{ duration: 0.4, repeat: Infinity, delay: j * 0.1 }} style={{ width: 4, background: p.color, borderRadius: 2 }} />)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div style={{ padding: isMobile ? '12px 14px' : '14px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', gap: isMobile ? 10 : 14 }}>
            {[Mic, VideoIcon, Monitor, Hand].map((Icon, i) => (
              <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} style={{ width: isMobile ? 40 : 44, height: isMobile ? 40 : 44, background: i < 2 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon style={{ width: isMobile ? 18 : 20, height: isMobile ? 18 : 20, color: i < 2 ? 'white' : '#52525b' }} />
              </motion.button>
            ))}
          </div>
        </AppChrome>
      </div>
    </section>
  );
}

// SECTION 6: Company Challenge
function ChallengeSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section ref={ref} style={{ background: '#0a0a0a', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 16 }}>Real company challenges</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} style={{ color: '#71717a', fontSize: isMobile ? 15 : 17, textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>Solve real problems, get ranked, build proof</motion.p>
        
        <AppChrome>
          <div style={{ background: '#0a0a0a', padding: isMobile ? '14px 16px' : '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <motion.div initial={{ rotate: 0 }} animate={isInView ? { rotate: [0, -5, 5, 0] } : {}} transition={{ delay: 0.5, duration: 0.5 }} style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: isMobile ? 10 : 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: isMobile ? 16 : 20, fontWeight: 700 }}>R</motion.div>
              <div>
                <span style={{ color: 'white', fontSize: isMobile ? 15 : 17, fontWeight: 600 }}>Rushly</span>
                <span style={{ background: 'rgba(255,107,107,0.15)', color: '#ff6b6b', fontSize: isMobile ? 9 : 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, marginLeft: 10 }}>LIVE</span>
              </div>
            </div>
          </div>
          
          <div style={{ padding: isMobile ? 16 : 22 }}>
            <h3 style={{ color: 'white', fontSize: isMobile ? 17 : 20, fontWeight: 700, marginBottom: isMobile ? 16 : 20 }}>Northeast Order Decline</h3>
            
            <div style={{ display: 'flex', gap: isMobile ? 16 : 24, marginBottom: isMobile ? 20 : 24, flexWrap: 'wrap' }}>
              {[
                { value: '-12%', label: 'Decline', color: '#ef4444' },
                { value: '$1.2B', label: 'At Risk', color: '#10b981' },
                { value: '127K', label: 'Churned', color: '#fff' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.1 }} style={{ textAlign: 'center', flex: isMobile ? '1 1 80px' : 'none' }}>
                  <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: isMobile ? 11 : 12, color: '#71717a', marginTop: 4 }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
            
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%', background: '#ff6b6b', color: 'white', fontSize: isMobile ? 14 : 15, fontWeight: 600, padding: isMobile ? '12px' : '14px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Start Challenge</motion.button>
          </div>
        </AppChrome>
      </div>
    </section>
  );
}

// SECTION 7: SQL Query Builder
function SQLSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [typed, setTyped] = useState("");
  const fullQuery = "SELECT customer_id, COUNT(*) as orders\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > 3;";

  useEffect(() => {
    if (isInView && typed.length < fullQuery.length) {
      const timer = setTimeout(() => setTyped(fullQuery.slice(0, typed.length + 1)), 40);
      return () => clearTimeout(timer);
    }
  }, [isInView, typed, fullQuery]);

  return (
    <section ref={ref} style={{ background: "#fafafa", padding: isMobile ? "60px 20px" : "100px 24px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: "#0a0a0a", textAlign: "center", marginBottom: 16 }}>Learn by doing</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} style={{ color: "#71717a", fontSize: isMobile ? 15 : 17, textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>Write real code, see instant results</motion.p>

        <AppChrome>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
            <div style={{ padding: isMobile ? 16 : 20, borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.05)", borderBottom: isMobile ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isMobile ? 12 : 16 }}>
                <Terminal style={{ width: 16, height: 16, color: "#f59e0b" }} />
                <span style={{ color: "#71717a", fontSize: isMobile ? 11 : 12, fontWeight: 600 }}>QUERY</span>
              </div>
              <pre style={{ fontFamily: "monospace", fontSize: isMobile ? 12 : 14, color: "#10b981", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {typed}
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ color: "#ff6b6b" }}>|</motion.span>
              </pre>
            </div>

            <div style={{ padding: isMobile ? 16 : 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isMobile ? 12 : 16 }}>
                <Table style={{ width: 16, height: 16, color: "#3b82f6" }} />
                <span style={{ color: "#71717a", fontSize: isMobile ? 11 : 12, fontWeight: 600 }}>RESULTS</span>
              </div>

              <motion.div initial={{ opacity: 0 }} animate={isInView && typed.length === fullQuery.length ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ background: "#1a1a1e", padding: isMobile ? "8px 10px" : "10px 14px", fontSize: isMobile ? 11 : 12, color: "#71717a", fontWeight: 600 }}>customer_id</div>
                  <div style={{ background: "#1a1a1e", padding: isMobile ? "8px 10px" : "10px 14px", fontSize: isMobile ? 11 : 12, color: "#71717a", fontWeight: 600 }}>orders</div>
                  {[[1042, 7], [1089, 5], [1156, 4]].map(([id, orders], i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={isInView && typed.length === fullQuery.length ? { opacity: 1 } : {}} transition={{ delay: 0.4 + i * 0.1 }} style={{ display: "contents" }}>
                      <div style={{ background: "#111113", padding: isMobile ? "8px 10px" : "10px 14px", fontSize: isMobile ? 12 : 13, color: "white" }}>{id}</div>
                      <div style={{ background: "#111113", padding: isMobile ? "8px 10px" : "10px 14px", fontSize: isMobile ? 12 : 13, color: "#10b981", fontWeight: 600 }}>{orders}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </AppChrome>
      </div>
    </section>
  );
}

// SECTION 8: Spaced Repetition
function RetentionSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section ref={ref} style={{ background: '#0a0a0a', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 16 }}>Never forget</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} style={{ color: '#71717a', fontSize: isMobile ? 15 : 17, textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>Built-in spaced repetition keeps it fresh</motion.p>
        
        <AppChrome compact>
          <div style={{ padding: isMobile ? 14 : 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 14 : 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <RefreshCw style={{ width: isMobile ? 18 : 20, height: isMobile ? 18 : 20, color: '#ec4899' }} />
                <span style={{ color: 'white', fontSize: isMobile ? 14 : 15, fontWeight: 600 }}>Daily Review</span>
              </div>
              <span style={{ color: '#10b981', fontSize: isMobile ? 12 : 13, fontWeight: 600 }}>5 min</span>
            </div>
            {['SQL JOINs', 'Retention formulas', 'A/B test basics'].map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.12 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: isMobile ? '12px 14px' : '14px 16px', marginBottom: 10 }}>
                <span style={{ color: 'white', fontSize: isMobile ? 13 : 14 }}>{t}</span>
                <span style={{ color: i === 0 ? '#f59e0b' : '#52525b', fontSize: isMobile ? 11 : 12, fontWeight: 500 }}>{i === 0 ? 'Due now' : i === 1 ? 'Tomorrow' : '3 days'}</span>
              </motion.div>
            ))}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%', marginTop: 10, background: 'linear-gradient(135deg, #ec4899, #db2777)', color: 'white', fontSize: isMobile ? 13 : 14, fontWeight: 600, padding: isMobile ? '12px' : '14px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Start Review</motion.button>
          </div>
        </AppChrome>
      </div>
    </section>
  );
}

// SECTION 9: Portfolio Preview
function PortfolioSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section ref={ref} style={{ background: '#fafafa', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: '#0a0a0a', textAlign: 'center', marginBottom: 16 }}>Verified portfolio</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} style={{ color: '#71717a', fontSize: isMobile ? 15 : 17, textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>Ranked work employers can verify</motion.p>
        
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} style={{ background: 'white', borderRadius: isMobile ? 24 : 28, overflow: 'hidden', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.15)' }}>
          <div style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)', padding: isMobile ? 24 : 28, textAlign: 'center' }}>
            <motion.div initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ delay: 0.4, type: 'spring' }} style={{ width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, background: 'white', borderRadius: isMobile ? 18 : 22, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#6366f1', fontSize: isMobile ? 24 : 32, fontWeight: 700, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' }}>AJ</motion.div>
            <h3 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: 'white' }}>Alex Johnson</h3>
            <p style={{ fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Data Analytics</p>
          </div>
          
          <div style={{ padding: isMobile ? 20 : 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20, textAlign: 'center' }}>
              {[
                { label: 'Rank', value: 'Top 15%' },
                { label: 'Projects', value: '8' },
                { label: 'Skills', value: '12' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.1 }}>
                  <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: '#0a0a0a' }}>{s.value}</div>
                  <div style={{ fontSize: isMobile ? 10 : 11, color: '#71717a' }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
            
            {[
              { title: 'Rushly Analysis', badge: 'Top 1%' },
              { title: 'Churn Prediction', badge: 'Top 5%' },
            ].map((w, i) => (
              <motion.div key={w.title} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.6 + i * 0.1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa', borderRadius: 12, padding: isMobile ? '12px 14px' : '14px 16px', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FileText style={{ width: isMobile ? 16 : 18, height: isMobile ? 16 : 18, color: '#10b981' }} />
                  <span style={{ fontSize: isMobile ? 13 : 14, fontWeight: 600, color: '#0a0a0a' }}>{w.title}</span>
                </div>
                <span style={{ background: 'rgba(255,107,107,0.1)', color: '#ff6b6b', fontSize: isMobile ? 10 : 11, fontWeight: 700, padding: '5px 10px', borderRadius: 100 }}>{w.badge}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 10: Mobile App
function MobileSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section ref={ref} style={{ background: '#0a0a0a', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr' : '1fr 1fr'), gap: isMobile ? 40 : 60, alignItems: 'center' }}>
          <div style={{ textAlign: isMobile ? 'center' : 'left', order: isMobile ? 2 : 1 }}>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: 'white', marginBottom: 16 }}>Learn anywhere</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} style={{ color: '#71717a', fontSize: isMobile ? 15 : 17, marginBottom: 32, lineHeight: 1.6 }}>Download lessons for offline. Learn on the train, at lunch, whenever. Pick up exactly where you left off.</motion.p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: isMobile ? 'center' : 'flex-start' }}>
              {[
                { icon: Download, text: 'Offline downloads' },
                { icon: Bell, text: 'Smart reminders' },
                { icon: RefreshCw, text: 'Syncs everywhere' },
              ].map((item, i) => (
                <motion.div key={item.text} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 + i * 0.1 }} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: isMobile ? 44 : 48, height: isMobile ? 44 : 48, background: 'rgba(6,182,212,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <item.icon style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, color: '#06b6d4' }} />
                  </div>
                  <span style={{ color: 'white', fontSize: isMobile ? 15 : 17, fontWeight: 500 }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} style={{ display: 'flex', justifyContent: 'center', order: isMobile ? 1 : 2 }}>
            <div style={{ 
              width: isMobile ? 260 : 300, 
              background: '#1c1c1e', 
              borderRadius: isMobile ? 40 : 50, 
              padding: isMobile ? 10 : 14, 
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 60px 100px -20px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', left: -3, top: 120, width: 4, height: 35, background: '#3a3a3c', borderRadius: '4px 0 0 4px' }} />
              <div style={{ position: 'absolute', left: -3, top: 180, width: 4, height: 70, background: '#3a3a3c', borderRadius: '4px 0 0 4px' }} />
              <div style={{ position: 'absolute', left: -3, top: 260, width: 4, height: 70, background: '#3a3a3c', borderRadius: '4px 0 0 4px' }} />
              <div style={{ position: 'absolute', right: -3, top: 170, width: 4, height: 90, background: '#3a3a3c', borderRadius: '0 4px 4px 0' }} />
              
              <div style={{ background: '#000', borderRadius: isMobile ? 32 : 40, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: isMobile ? 10 : 14, left: '50%', transform: 'translateX(-50%)', width: isMobile ? 80 : 100, height: isMobile ? 24 : 30, background: '#000', borderRadius: 20, zIndex: 10 }} />
                
                <div style={{ padding: isMobile ? '16px 20px 8px' : '20px 28px 10px', display: 'flex', justifyContent: 'space-between', paddingTop: isMobile ? 44 : 56 }}>
                  <span style={{ color: 'white', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>9:41</span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Signal style={{ width: isMobile ? 14 : 16, height: isMobile ? 14 : 16, color: 'white' }} />
                    <Wifi style={{ width: isMobile ? 14 : 16, height: isMobile ? 14 : 16, color: 'white' }} />
                    <Battery style={{ width: isMobile ? 20 : 24, height: isMobile ? 10 : 12, color: 'white' }} />
                  </div>
                </div>
                
                <div style={{ padding: isMobile ? '8px 18px 20px' : '10px 22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 20 : 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10 }}>
                      <div style={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, background: '#ff6b6b', borderRadius: isMobile ? 7 : 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: isMobile ? 12 : 14, fontWeight: 800 }}>A</span>
                      </div>
                      <span style={{ color: 'white', fontSize: isMobile ? 15 : 17, fontWeight: 600 }}>APEX</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Flame style={{ width: isMobile ? 14 : 16, height: isMobile ? 14 : 16, color: '#f59e0b' }} />
                      <span style={{ color: '#f59e0b', fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>12</span>
                    </div>
                  </div>
                  
                  <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.15)', borderRadius: isMobile ? 14 : 18, padding: isMobile ? 14 : 18, marginBottom: 16 }}>
                    <span style={{ background: '#ff6b6b', color: 'white', fontSize: isMobile ? 9 : 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>CONTINUE</span>
                    <h4 style={{ color: 'white', fontSize: isMobile ? 15 : 17, fontWeight: 600, marginTop: 12 }}>SQL Fundamentals</h4>
                    <p style={{ color: '#71717a', fontSize: isMobile ? 12 : 13, marginTop: 4 }}>Module 3: JOINs</p>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 100, marginTop: 14 }}>
                      <motion.div initial={{ width: 0 }} animate={isInView ? { width: '65%' } : {}} transition={{ duration: 1.5, delay: 0.5 }} style={{ height: '100%', background: 'linear-gradient(90deg, #ff6b6b, #f59e0b)', borderRadius: 100 }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? 10 : 12 }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: isMobile ? 12 : 16, textAlign: 'center' }}>
                      <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#10b981' }}>47</div>
                      <div style={{ fontSize: isMobile ? 11 : 12, color: '#71717a' }}>Lessons</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: isMobile ? 12 : 16, textAlign: 'center' }}>
                      <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: '#ff6b6b' }}>Top 15%</div>
                      <div style={{ fontSize: isMobile ? 11 : 12, color: '#71717a' }}>Rank</div>
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: isMobile ? '12px 0 26px' : '14px 0 32px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-around' }}>
                  {[Home, BookOpen, Trophy, User].map((Icon, i) => <Icon key={i} style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, color: i === 0 ? '#ff6b6b' : '#52525b' }} />)}
                </div>
                
                <div style={{ position: 'absolute', bottom: isMobile ? 8 : 10, left: '50%', transform: 'translateX(-50%)', width: isMobile ? 120 : 140, height: 5, background: 'white', borderRadius: 100 }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// SECTION 11: Pricing
function PricingSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <section ref={ref} style={{ background: '#fafafa', padding: isMobile ? '60px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: 450, margin: '0 auto', textAlign: 'center' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: '#0a0a0a', marginBottom: isMobile ? 32 : 48 }}>Everything included</motion.h2>
        
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} style={{ background: 'white', borderRadius: isMobile ? 24 : 28, padding: isMobile ? 28 : 40, boxShadow: '0 25px 60px -15px rgba(0,0,0,0.1)', border: '2px solid #ff6b6b' }}>
          <div style={{ fontSize: isMobile ? 48 : 64, fontWeight: 900, color: '#0a0a0a', lineHeight: 1 }}>$500<span style={{ fontSize: isMobile ? 18 : 24, color: '#71717a', fontWeight: 500 }}>/mo</span></div>
          <p style={{ color: '#71717a', fontSize: isMobile ? 14 : 16, marginTop: 8, marginBottom: 28 }}>for 24 months</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 8 : 10, flexWrap: 'wrap' }}>
            {['Lessons', 'AI Tutor', 'Challenges', 'Career Support'].map((item) => (
              <span key={item} style={{ background: '#f4f4f5', color: '#52525b', fontSize: isMobile ? 12 : 13, fontWeight: 500, padding: isMobile ? '6px 12px' : '8px 16px', borderRadius: 100 }}>{item}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// SECTION 12: Job Offer with Confetti
function JobOfferSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (isInView && !showConfetti) {
      const timer = setTimeout(() => setShowConfetti(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, showConfetti]);
  
  return (
    <section ref={ref} style={{ background: '#0a0a0a', padding: isMobile ? '60px 20px' : '100px 24px', position: 'relative', overflow: 'hidden' }}>
      <Confetti active={showConfetti} />
      
      <div style={{ maxWidth: 550, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ fontSize: isMobile ? 28 : (isTablet ? 36 : 44), fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 16 }}>This is where it leads</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }} style={{ color: '#71717a', fontSize: isMobile ? 15 : 17, textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>A job you actually want</motion.p>
        
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ delay: 0.2 }} style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)', borderRadius: isMobile ? 24 : 32, padding: isMobile ? 28 : 56, textAlign: 'center', border: '1px solid rgba(16,185,129,0.3)' }}>
          <motion.div animate={isInView ? { y: [0, -12, 0] } : {}} transition={{ duration: 3, repeat: Infinity }} style={{ width: isMobile ? 80 : 100, height: isMobile ? 80 : 100, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: isMobile ? 22 : 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: 'white', fontSize: isMobile ? 36 : 48, fontWeight: 700, boxShadow: '0 25px 60px -15px rgba(16,185,129,0.5)' }}>R</motion.div>
          
          <motion.div initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ delay: 0.4, type: "spring", bounce: 0.5 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.2)', padding: isMobile ? '8px 16px' : '10px 20px', borderRadius: 100, marginBottom: 20 }}>
            <BadgeCheck style={{ width: isMobile ? 18 : 20, height: isMobile ? 18 : 20, color: '#10b981' }} />
            <span style={{ color: '#10b981', fontSize: isMobile ? 13 : 14, fontWeight: 700 }}>HIRED</span>
          </motion.div>
          
          <h3 style={{ fontSize: isMobile ? 28 : 48, fontWeight: 900, color: 'white', marginBottom: 12 }}>You Got the Job</h3>
          <p style={{ color: '#a1a1aa', fontSize: isMobile ? 15 : 17, marginBottom: 36 }}>Data Analyst at Rushly</p>
          
          <div style={{ display: 'flex', gap: isMobile ? 20 : 48, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Base', value: '$125K' },
              { label: 'Bonus', value: '$20K' },
              { label: 'Year 1', value: '$165K', highlight: true },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.1 }}>
                <div style={{ color: '#71717a', fontSize: isMobile ? 11 : 12, marginBottom: 6 }}>{item.label}</div>
                <div style={{ color: item.highlight ? '#10b981' : 'white', fontSize: item.highlight ? (isMobile ? 32 : 40) : (isMobile ? 22 : 28), fontWeight: 900 }}>{item.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// CTA
function CTASection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigateWithScroll = useScrollSave();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <section ref={ref} style={{ background: '#fafafa', padding: isMobile ? '60px 20px 80px' : '100px 24px 120px' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: isMobile ? 32 : 52, fontWeight: 900, color: '#0a0a0a', marginBottom: 20 }}>Ready?</h2>
        
        <motion.button onClick={() => navigateWithScroll('/apply')} whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)', color: 'white', fontSize: isMobile ? 16 : 18, fontWeight: 700, padding: isMobile ? '16px 32px' : '20px 40px', borderRadius: 100, border: 'none', cursor: 'pointer', boxShadow: '0 15px 50px -10px rgba(255,107,107,0.5)' }}>
          Apply Now <ArrowRight style={{ width: isMobile ? 20 : 22, height: isMobile ? 20 : 22 }} />
        </motion.button>
        
        <p style={{ color: '#a1a1aa', fontSize: isMobile ? 14 : 15, marginTop: 20 }}>$500/mo for 24 months</p>
      </motion.div>
    </section>
  );
}

function Footer() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <footer style={{ padding: isMobile ? '20px 0' : '28px 0', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 20px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white' }}>
          <Image src="/APEX-Final-White.svg?v=100" alt="APEX" width={18} height={18} style={{ height: 18, width: 18 }} unoptimized />
          <span style={{ fontSize: 13, fontWeight: 500 }}>APEX</span>
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#52525b' }}>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy</a>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default function LearnMorePage() {
  return (
    <>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');*{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}body{margin:0;padding:0;overflow-x:hidden}::selection{background:rgba(255,107,107,0.2)}a{text-decoration:none}`}</style>
      <main style={{ minHeight: '100vh', background: '#0a0a0a', overflowX: 'hidden' }}>
        <Nav />
        <Hero />
        <JourneySection />
        <DashboardSection />
        <VideoSection />
        <AITutorSection />
        <PeerSection />
        <ChallengeSection />
        <SQLSection />
        <RetentionSection />
        <PortfolioSection />
        <MobileSection />
        <PricingSection />
        <JobOfferSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}