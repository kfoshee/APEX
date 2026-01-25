"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Play } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const BRAND = "APEX";
const APPLY_URL = "#pricing";
const PRICE = "$500/mo";
const smooth = [0.16, 1, 0.3, 1];

// Reusable animation variants
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: smooth },
  },
};

// ============================================
// HERO
// ============================================
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Animated gradient orbs - smoother */}
      <motion.div
        className="absolute top-[-30%] right-[-20%] w-[900px] h-[900px] rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(255,107,107,0.2) 0%, transparent 50%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(255,150,100,0.15) 0%, transparent 50%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 15, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Floating particles - smoother */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#ff6b6b] rounded-full"
          style={{
            left: `${15 + i * 18}%`,
            top: `${25 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: smooth, delay: 0.2 }}
        className="relative z-20 px-6 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.a href="#" className="flex items-center gap-2 text-white">
            <Image
              src="/APEX-Final-White.svg?v=100"
              alt="APEX"
              width={28}
              height={28}
              className="h-7 w-7 select-none"
              priority
              unoptimized
            />
            <span className="text-sm font-medium tracking-wide">APEX</span>
          </motion.a>          <div className="flex items-center gap-8">
            <motion.a
              href="#what"
              className="text-zinc-500 text-sm hover:text-white transition-colors duration-300 hidden md:block"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3, ease: smooth }}
            >
              What is APEX
            </motion.a>
            <motion.a
              href="#method"
              className="text-zinc-500 text-sm hover:text-white transition-colors duration-300 hidden md:block"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3, ease: smooth }}
            >
              Method
            </motion.a>
            <motion.a
              href="#pricing"
              className="text-zinc-500 text-sm hover:text-white transition-colors duration-300 hidden md:block"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3, ease: smooth }}
            >
              Pricing
            </motion.a>
            <motion.a
              href={APPLY_URL}
              className="text-[#ff6b6b] text-sm font-medium"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.3, ease: smooth }}
            >
              Apply →
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Main content */}
      <motion.div style={{ y, opacity }} className="relative z-10 px-6 pt-[15vh] pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: smooth, delay: 0.3 }}
            className="flex items-center gap-3 mb-8"
          >
            <motion.span
              className="w-2 h-2 bg-[#ff6b6b] rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-zinc-500 text-sm">Cohort now open</span>
          </motion.div>

          {/* Giant headline */}
          <motion.h1
            className="text-[clamp(3rem,10vw,8rem)] font-bold text-white leading-[0.95] tracking-[-0.04em] max-w-5xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: smooth, delay: 0.4 }}
              className="block"
            >
              Get hired for
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: smooth, delay: 0.55 }}
              className="block text-[#ff6b6b]"
            >
              what you can do
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: smooth, delay: 0.8 }}
            className="mt-12 ml-auto max-w-md"
          >
            <p className="text-zinc-400 text-lg leading-relaxed">
              Skip the traditional degree. Complete real challenges. Build a portfolio employers can actually evaluate.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <motion.a
                href={APPLY_URL}
                className="group inline-flex items-center gap-2 bg-[#ff6b6b] text-white text-sm font-medium px-6 py-3 rounded-full"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: smooth }}
              >
                Start building
                <motion.span className="inline-block">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.span>
              </motion.a>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-zinc-600 text-sm"
              >
                {PRICE} · Invest in your future
              </motion.span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-zinc-800"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: smooth, delay: 0.8 }}
        style={{ originX: 0 }}
      />

      {/* Scroll indicator */}

    </section>
  );
}

function ApexLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden="true" className={className} fill="none">
      {/* Red apex */}
      <path
        fill="#ff6b6b"
        fillRule="evenodd"
        d="M500 120
           L210 720
           L330 720
           L500 380
           L670 720
           L790 720
           Z
           M500 265
           L370 680
           L440 680
           L500 560
           L560 680
           L630 680
           Z"
      />
      {/* “Black” chevron becomes currentColor (white in nav, black elsewhere) */}
      <path
        fill="currentColor"
        d="M260 720
           L500 610
           L740 720
           L640 720
           L500 660
           L360 720
           Z"
      />
    </svg>
  );
}

// ============================================
// WHAT IS APEX
// ============================================
// ============================================
// WHAT IS APEX
// ============================================
function WhatIsApex() {
  const sectionRef = useRef(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasWatched, setHasWatched] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Scroll-based animations - smooth scale to full width
  const { scrollYProgress } = useScroll({
    target: videoContainerRef,
    offset: ["start end", "center center"],
  });

  // Smooth scale from small to full size
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [40, 16]);

  // Check if video is in center viewport for auto-play
  const videoInView = useInView(videoContainerRef, {
    margin: "-35% 0px -35% 0px",
  });

  // Auto-play when video enters center of viewport
  useEffect(() => {
    if (videoRef.current) {
      if (videoInView && !hasWatched) {
        videoRef.current.play().catch(() => { });
        setIsPlaying(true);
      } else if (!videoInView && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [videoInView, hasWatched, isPlaying]);

  // Handle video end
  const handleVideoEnd = () => {
    setHasWatched(true);
    setIsPlaying(false);
  };

  // Handle manual play
  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => { });
        setIsPlaying(true);
        setHasWatched(false);
      }
    }
  };

  return (
    <section id="what" className="py-24 bg-white overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={0}
          className="text-center mb-10"
        >
          <span className="text-[#ff6b6b] text-sm font-medium">What is APEX?</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-zinc-900 tracking-[-0.03em] leading-[1.1]">
            A new way to prove
            <br />
            what you can do
          </h2>
        </motion.div>

        {/* Video section with smooth scroll-based scaling */}
        <div
          ref={videoContainerRef}
          className="relative max-w-6xl mx-auto mb-20"
        >
          <motion.div
            style={{
              scale,
              opacity,
              borderRadius,
            }}
            className="relative aspect-video bg-zinc-900 overflow-hidden"
          >
            {/* Actual video element */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/your-video.mp4"
              playsInline
              muted
              onEnded={handleVideoEnd}
            />

            {/* Overlay gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 pointer-events-none"
              animate={{ opacity: isPlaying ? 0 : 1 }}
              transition={{ duration: 0.6, ease: smooth }}
            />

            {/* Animated background pattern when not playing */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: isPlaying ? 0 : 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,107,107,0.1) 0%, transparent 50%)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Play button overlay */}
            <AnimatePresence mode="wait">
              {!isPlaying && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: smooth }}
                >
                  <motion.button
                    onClick={handlePlayClick}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative w-20 h-20 bg-[#ff6b6b] rounded-full flex items-center justify-center group"
                  >
                    {/* Pulse rings */}
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#ff6b6b]"
                      animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#ff6b6b]"
                      animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                    />
                    <Play className="w-8 h-8 text-white ml-1 relative z-10" fill="white" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Click to pause overlay */}
            {isPlaying && (
              <motion.button
                onClick={handlePlayClick}
                className="absolute inset-0 w-full h-full cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                aria-label="Pause video"
              />
            )}

            {/* Bottom text */}
            <motion.div
              className="absolute bottom-5 left-0 right-0 text-center pointer-events-none"
              animate={{
                opacity: isPlaying ? 0 : 1,
                y: isPlaying ? 10 : 0
              }}
              transition={{ duration: 0.4, ease: smooth }}
            >
              <p className="text-zinc-300 text-sm">
                {hasWatched ? "Click to watch again" : "Watch how APEX works"}
              </p>
            </motion.div>

            {/* Decorative corners */}
            <motion.div
              className="absolute top-5 left-5 w-16 h-12 border border-white/20 rounded-lg pointer-events-none"
              animate={{
                opacity: isPlaying ? 0 : [0.2, 0.4, 0.2],
                scale: isPlaying ? 0.9 : 1,
              }}
              transition={{
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.4 }
              }}
            />
            <motion.div
              className="absolute bottom-5 right-5 w-20 h-14 border border-white/20 rounded-lg pointer-events-none"
              animate={{
                opacity: isPlaying ? 0 : [0.15, 0.35, 0.15],
                scale: isPlaying ? 0.9 : 1,
              }}
              transition={{
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
                scale: { duration: 0.4 }
              }}
            />
          </motion.div>

          {/* Playing indicator */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3, ease: smooth }}
              >
                <motion.span
                  className="w-1.5 h-1.5 bg-[#ff6b6b] rounded-full"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-zinc-400 text-xs">Playing</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Earn the APEX Degree */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={0.3}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="relative">
              <motion.span
                className="inline-block text-[#ff6b6b] text-sm font-medium uppercase tracking-wider mb-4"
                variants={staggerItem}
              >
                The credential
              </motion.span>
              <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-[-0.02em]">
                Earn the APEX Degree
              </h3>
              <p className="mt-6 text-zinc-600 text-lg leading-relaxed max-w-2xl mx-auto">
                The APEX degree is a portfolio of verified work that commands respect. When employers see APEX on your resume, they know you've mastered real-world challenges and defended your expertise live.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// JOURNEY
// ============================================
function Journey() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="method" className="py-32 bg-[#fafafa]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={0}
          className="text-center mb-20"
        >
          <span className="text-[#ff6b6b] text-sm font-medium">Your 2-year journey</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-zinc-900 tracking-[-0.03em]">
            Here's how it works
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-4 gap-5 max-w-6xl mx-auto"
        >
          {[
            {
              phase: "Year 1",
              title: "Learn the fundamentals",
              desc: "Master core skills with AI-powered tutoring at your own pace.",
              dark: false,
            },
            {
              phase: "Year 1-2",
              title: "Build real projects",
              desc: "Complete challenges from actual companies. Build your portfolio.",
              dark: false,
            },
            {
              phase: "Year 2",
              title: "Specialize & deepen",
              desc: "Choose your focus. Tackle harder challenges that showcase expertise.",
              dark: false,
            },
            {
              phase: "Graduation",
              title: "Earn the APEX degree",
              desc: "Defend your portfolio live. Graduate with proof that speaks.",
              dark: true,
            },
          ].map((step) => (
            <motion.div
              key={step.phase}
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.4, ease: smooth } }}
              className={`rounded-2xl p-6 border ${step.dark ? 'bg-[#0a0a0a] border-transparent' : 'bg-white border-zinc-100'}`}
            >
              <span className={`text-xs font-medium uppercase tracking-wider ${step.dark ? 'text-[#ff6b6b]' : 'text-zinc-400'}`}>
                {step.phase}
              </span>
              <h3 className={`mt-4 text-lg font-semibold ${step.dark ? 'text-white' : 'text-zinc-900'}`}>
                {step.title}
              </h3>
              <p className={`mt-3 text-sm leading-relaxed ${step.dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
// ============================================
// COMPARISON
// ============================================
function Comparison() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={0}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-[-0.03em]">
            Why APEX is different
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: smooth, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.4, ease: smooth } }}
            className="bg-zinc-100 rounded-3xl p-10"
          >
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Traditional degree</p>
            <div className="mt-10 space-y-8">
              {[
                { label: "Cost", value: "$100k – $200k" },
                { label: "Time", value: "4 years" },
                { label: "Format", value: "Lectures & exams" },
                { label: "What you get", value: "A transcript" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, ease: smooth, delay: 0.4 + i * 0.1 }}
                >
                  <p className="text-zinc-400 text-sm">{item.label}</p>
                  <p className="text-2xl font-semibold text-zinc-400 mt-1">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: smooth, delay: 0.3 }}
            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.4, ease: smooth } }}
            className="bg-[#0a0a0a] rounded-3xl p-10 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />
            <p className="text-[#ff6b6b] text-sm font-medium uppercase tracking-wider relative">APEX degree</p>
            <div className="mt-10 space-y-8 relative">
              {[
                { label: "Cost", value: PRICE },
                { label: "Time", value: "2 years" },
                { label: "Format", value: "Real challenges" },
                { label: "What you get", value: "A portfolio" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, ease: smooth, delay: 0.5 + i * 0.1 }}
                >
                  <p className="text-zinc-500 text-sm">{item.label}</p>
                  <p className="text-2xl font-semibold text-white mt-1">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// TRACK
// ============================================
function Track() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 bg-[#fafafa]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            custom={0}
            className="lg:w-1/2"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, ease: smooth }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-6"
            >
              <motion.span
                className="w-1.5 h-1.5 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              Now enrolling
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-[-0.03em]">
              Data Analyst Track
            </h2>
            <p className="mt-6 text-xl text-zinc-500 leading-relaxed">
              Find truth in messy data. Explain it to people who aren't technical. Graduate with proof you can do the job.
            </p>
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="mt-8 flex flex-wrap gap-2"
            >
              {["Python", "SQL", "Pandas", "Tableau", "Statistics"].map((skill) => (
                <motion.span
                  key={skill}
                  variants={staggerItem}
                  whileHover={{ y: -3, backgroundColor: "#f4f4f5", transition: { duration: 0.3, ease: smooth } }}
                  className="px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm text-zinc-600 cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            custom={0.2}
            className="lg:w-1/2"
          >
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-6">Example challenges</p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-4"
            >
              {[
                "Investigate why three data sources tell different stories",
                "Figure out why revenue dropped 15% last quarter",
                "Build a dashboard that helps a team make decisions",
                "Write a memo that explains complex findings to executives",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover={{ x: 8, transition: { duration: 0.3, ease: smooth } }}
                  className="flex items-start gap-4 bg-white border border-zinc-200 rounded-2xl p-5 cursor-default"
                >
                  <motion.span
                    whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                    className="w-8 h-8 bg-[#0a0a0a] text-white text-sm font-medium rounded-lg flex items-center justify-center shrink-0"
                  >
                    {i + 1}
                  </motion.span>
                  <p className="text-zinc-700 pt-1">{item}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRICING
// ============================================
function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="py-32 bg-white" ref={ref}>
      <div className="max-w-lg mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={0}
          className="text-center"
        >
          <h2 className="text-5xl font-bold text-zinc-900 tracking-[-0.03em]">{PRICE}</h2>
          <p className="mt-2 text-zinc-500">Invest in your future. 24 months. Everything included.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={0.15}
          whileHover={{ y: -5, transition: { duration: 0.4, ease: smooth } }}
          className="mt-12 bg-[#fafafa] rounded-3xl p-8"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 gap-4"
          >
            {[
              "AI tutor",
              "All challenges",
              "Rubric feedback",
              "Office hours",
              "Live defenses",
              "APEX degree",
            ].map((item) => (
              <motion.div
                key={item}
                variants={staggerItem}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-[#ff6b6b]" />
                <span className="text-sm text-zinc-600">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.a
            href={APPLY_URL}
            whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: smooth } }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium py-4 rounded-full hover:bg-zinc-800 transition-colors duration-300"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </motion.a>

          <p className="mt-4 text-center text-xs text-zinc-400">
            Limited spots available. Applications reviewed weekly.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// EMPLOYERS
// ============================================
function Employers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 bg-[#0a0a0a] overflow-hidden relative" ref={ref}>
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 60%)",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            custom={0}
          >
            <span className="text-zinc-500 text-sm font-medium">For employers</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.1]">
              See the work
              <br />
              before you hire
            </h2>
            <p className="mt-6 text-zinc-400 text-lg">
              APEX graduates come with a portfolio of real work. No more guessing if they can do the job.
            </p>
            <motion.a
              href="#"
              whileHover={{ x: 5, transition: { duration: 0.3, ease: smooth } }}
              className="mt-8 inline-flex items-center gap-2 text-[#ff6b6b] text-sm font-medium"
            >
              Partner with APEX
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { num: "01", text: "Browse portfolios" },
              { num: "02", text: "See actual work" },
              { num: "03", text: "Watch defenses" },
              { num: "04", text: "Hire with confidence" },
            ].map((item) => (
              <motion.div
                key={item.num}
                variants={staggerItem}
                whileHover={{ scale: 1.05, backgroundColor: "#27272a", transition: { duration: 0.3, ease: smooth } }}
                className="bg-zinc-900 rounded-2xl p-6 cursor-default"
              >
                <span className="text-zinc-600 text-xs font-medium">{item.num}</span>
                <p className="mt-3 text-white font-medium">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ
// ============================================
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const faqs = [
    { q: "Is the APEX degree accredited?", a: "APEX is a new kind of credential built on proof of work. Employers can see exactly what you're capable of through your portfolio." },
    { q: "Can I use AI tools?", a: "Yes. Use whatever tools help you do great work. But you defend everything in a live session—if you can't explain your approach, you don't pass." },
    { q: "What's the time commitment?", a: "Plan for 10-15 hours per week over 2 years. You'll have structured milestones, but flexibility in how you get there." },
    { q: "What do employers see when I graduate?", a: "Everything. Your code, dashboards, written memos, recordings of your live defenses, and your rubric scores." },
    { q: "What if I already have a degree?", a: "Many students will. APEX isn't about replacing what you have—it's about proving what you can do." },
  ];

  return (
    <section className="py-32 bg-white" ref={ref}>
      <div className="max-w-2xl mx-auto px-6">
        <motion.h2
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-10"
        >
          Frequently asked questions
        </motion.h2>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="space-y-0"
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              variants={staggerItem}
              className="border-b border-zinc-100"
            >
              <motion.button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group"
                whileHover={{ x: 3, transition: { duration: 0.3, ease: smooth } }}
              >
                <span className="text-lg font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors duration-300">{faq.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: smooth }}
                  className="text-zinc-400 text-2xl font-light"
                >
                  +
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: smooth }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-zinc-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: smooth }}
      viewport={{ once: true }}
      className="py-8 bg-[#fafafa] border-t border-zinc-200"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-900">
          <Image
            src="/APEX-Final-Black.svg?v=100"
            alt="APEX"
            width={28}
            height={28}
            className="h-7 w-7 select-none"
            unoptimized
          />
          <span className="text-sm font-medium">{BRAND}</span>
        </div>

        <div className="flex gap-6 text-sm text-zinc-400">
          <motion.a href="#" whileHover={{ color: "#52525b" }} transition={{ duration: 0.3 }}>
            Privacy
          </motion.a>
          <motion.a href="#" whileHover={{ color: "#52525b" }} transition={{ duration: 0.3 }}>
            Terms
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
}

// ============================================
// PAGE
// ============================================
export default function Page() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        
        * {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
        }
        
        ::selection {
          background: rgba(255, 107, 107, 0.2);
        }
      `}</style>
      <main className="min-h-screen">
        <Hero />
        <WhatIsApex />
        <Journey />
        <Comparison />
        <Track />
        <Pricing />
        <Employers />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}