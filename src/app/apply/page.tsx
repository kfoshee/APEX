"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, Check, X, FileText, Loader2, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const smooth: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Validation functions
const validators = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return null;
  },
  name: (value: string) => {
    if (!value) return "Name is required";
    if (value.length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(value)) return "Name can only contain letters, spaces, hyphens, and apostrophes";
    return null;
  },
  phone: (value: string) => {
    if (!value) return null;
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(value)) return "Please enter a valid phone number";
    return null;
  },
  linkedin: (value: string) => {
    if (!value) return null;
    if (!value.includes("linkedin.com/") && !value.startsWith("linkedin.com")) {
      return "Please enter a valid LinkedIn URL";
    }
    return null;
  },
  portfolio: (value: string) => {
    if (!value) return null;
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(value) && !value.includes(".")) {
      return "Please enter a valid URL";
    }
    return null;
  },
  why: (value: string) => {
    if (!value) return "This field is required";
    const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 50) return `Please write at least 50 words (currently ${wordCount})`;
    if (wordCount > 200) return `Please keep it under 200 words (currently ${wordCount})`;
    return null;
  },
  school: (value: string) => {
    if (!value) return null;
    if (value.length < 2) return "Please enter a valid school name";
    return null;
  },
};

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            height: 4,
            borderRadius: 2,
            width: i === currentStep ? 48 : 32,
            background: i <= currentStep ? '#ff6b6b' : '#27272a',
            transition: 'all 0.5s ease'
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: smooth }}
        />
      ))}
    </div>
  );
}

function FileUpload({
  label,
  name,
  accept,
  hint,
  file,
  onFileChange,
  required = false,
  error,
}: {
  label: string;
  name: string;
  accept: string;
  hint: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  required?: boolean;
  error?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragIn = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragOut = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) onFileChange(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, color: '#d4d4d8', marginBottom: 8 }}>
        {label} {required && <span style={{ color: '#ff6b6b' }}>*</span>}
      </label>
      <motion.div
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        style={{
          position: 'relative',
          cursor: 'pointer',
          borderRadius: 16,
          border: `2px dashed ${error ? 'rgba(239,68,68,0.5)' : isDragging ? '#ff6b6b' : '#27272a'}`,
          background: error ? 'rgba(239,68,68,0.05)' : isDragging ? 'rgba(255,107,107,0.05)' : file ? 'rgba(24,24,27,0.5)' : 'rgba(24,24,27,0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        <input ref={inputRef} type="file" name={name} accept={accept} style={{ display: 'none' }} onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
        <div style={{ padding: 32, textAlign: 'center' }}>
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(255,107,107,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText style={{ width: 20, height: 20, color: '#ff6b6b' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{file.name}</p>
                  <p style={{ color: '#71717a', fontSize: 12, margin: 0 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <motion.button type="button" onClick={(e) => { e.stopPropagation(); onFileChange(null); }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ marginLeft: 8, width: 32, height: 32, background: '#27272a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: '#a1a1aa' }} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div style={{ width: 48, height: 48, background: '#27272a', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <Upload style={{ width: 20, height: 20, color: '#a1a1aa' }} />
                </motion.div>
                <p style={{ color: '#a1a1aa', fontSize: 14, margin: 0 }}><span style={{ color: '#ff6b6b', fontWeight: 500 }}>Click to upload</span> or drag and drop</p>
                <p style={{ color: '#52525b', fontSize: 12, marginTop: 4 }}>{hint}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} style={{ marginTop: 8, fontSize: 14, color: '#f87171', display: 'flex', alignItems: 'center', gap: 4 }}>
            <AlertCircle style={{ width: 12, height: 12 }} />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ label, name, type = "text", placeholder, required = false, value, onChange, error, onBlur }: { label: string; name: string; type?: string; placeholder: string; required?: boolean; value: string; onChange: (value: string) => void; error?: string | null; onBlur?: () => void; }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smooth }}>
      <label style={{ display: 'block', fontSize: 14, color: '#d4d4d8', marginBottom: 8 }}>
        {label} {required && <span style={{ color: '#ff6b6b' }}>*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        style={{
          width: '100%',
          borderRadius: 12,
          background: '#18181b',
          border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : '#27272a'}`,
          padding: '14px 16px',
          outline: 'none',
          color: 'white',
          fontSize: 15,
          transition: 'border-color 0.3s ease',
          boxSizing: 'border-box'
        }}
        placeholder={placeholder}
        onFocus={(e) => e.target.style.borderColor = error ? '#ef4444' : '#ff6b6b'}
        onBlurCapture={(e) => e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : '#27272a'}
      />
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} style={{ marginTop: 8, fontSize: 14, color: '#f87171', display: 'flex', alignItems: 'center', gap: 4 }}>
            <AlertCircle style={{ width: 12, height: 12 }} />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SelectField({ label, name, options, required = false, value, onChange }: { label: string; name: string; options: string[]; required?: boolean; value: string; onChange: (value: string) => void; }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smooth }}>
      <label style={{ display: 'block', fontSize: 14, color: '#d4d4d8', marginBottom: 8 }}>
        {label} {required && <span style={{ color: '#ff6b6b' }}>*</span>}
      </label>
      <select
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          borderRadius: 12,
          background: '#18181b',
          border: '1px solid #27272a',
          padding: '14px 16px',
          outline: 'none',
          color: 'white',
          fontSize: 15,
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
          backgroundSize: '1.25rem',
          boxSizing: 'border-box'
        }}
      >
        {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
    </motion.div>
  );
}

function TextareaField({ label, name, placeholder, required = false, rows = 4, value, onChange, error, onBlur, hint }: { label: string; name: string; placeholder: string; required?: boolean; rows?: number; value: string; onChange: (value: string) => void; error?: string | null; onBlur?: () => void; hint?: string; }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smooth }}>
      <label style={{ display: 'block', fontSize: 14, color: '#d4d4d8', marginBottom: 8 }}>
        {label} {required && <span style={{ color: '#ff6b6b' }}>*</span>}
      </label>
      <textarea
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        style={{
          width: '100%',
          borderRadius: 12,
          background: '#18181b',
          border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : '#27272a'}`,
          padding: '14px 16px',
          outline: 'none',
          color: 'white',
          fontSize: 15,
          resize: 'none',
          boxSizing: 'border-box',
          fontFamily: 'inherit'
        }}
        placeholder={placeholder}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} style={{ fontSize: 14, color: '#f87171', display: 'flex', alignItems: 'center', gap: 4, margin: 0 }}>
              <AlertCircle style={{ width: 12, height: 12 }} />{error}
            </motion.p>
          )}
        </AnimatePresence>
        {hint && !error && <p style={{ fontSize: 12, color: '#52525b', marginLeft: 'auto', margin: 0 }}>{hint}</p>}
      </div>
    </motion.div>
  );
}

export default function ApplyPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", track: "Data Analyst", currentStatus: "Student", school: "", linkedin: "", portfolio: "", hearAbout: "Social Media", why: "", goals: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [satScoreFile, setSatScoreFile] = useState<File | null>(null);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateField = (field: string, value: string) => {
    const validator = validators[field as keyof typeof validators];
    if (validator) {
      const error = validator(value);
      setErrors((prev) => ({ ...prev, [field]: error }));
      return error === null;
    }
    return true;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  const totalSteps = 3;

  const validateStep = (stepIndex: number): boolean => {
    if (stepIndex === 0) {
      const nameError = validators.name(formData.name);
      const emailError = validators.email(formData.email);
      const phoneError = validators.phone(formData.phone);
      const schoolError = validators.school(formData.school);
      setErrors({ ...errors, name: nameError, email: emailError, phone: phoneError, school: schoolError });
      setTouched({ ...touched, name: true, email: true, phone: true, school: true });
      return !nameError && !emailError && !phoneError && !schoolError;
    }
    if (stepIndex === 1) {
      const linkedinError = validators.linkedin(formData.linkedin);
      const portfolioError = validators.portfolio(formData.portfolio);
      setErrors({ ...errors, linkedin: linkedinError, portfolio: portfolioError });
      setTouched({ ...touched, linkedin: true, portfolio: true });
      if (!resumeFile) { setErrors((prev) => ({ ...prev, resume: "Resume is required" })); return false; }
      return !linkedinError && !portfolioError;
    }
    if (stepIndex === 2) {
      const whyError = validators.why(formData.why);
      setErrors({ ...errors, why: whyError });
      setTouched({ ...touched, why: true });
      return !whyError;
    }
    return true;
  };

  const canProceed = () => {
    if (step === 0) return formData.name && formData.email && !errors.name && !errors.email;
    if (step === 1) return resumeFile !== null && !errors.linkedin && !errors.portfolio;
    const wordCount = formData.why.trim().split(/\s+/).filter(word => word.length > 0).length;
    return wordCount >= 50 && wordCount <= 200 && !errors.why;
  };

  const handleNextStep = () => { if (validateStep(step)) setStep(step + 1); };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateStep(step)) return;
    setStatus("sending");
    setMessage("");
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));
    if (resumeFile) form.append("resume", resumeFile);
    if (satScoreFile) form.append("satScore", satScoreFile);
    try {
      const res = await fetch("/api/apply", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setStatus("error"); setMessage(data?.error || "Something went wrong. Try again."); return; }
      setStatus("sent");
      setMessage("Application received. We'll follow up soon.");
    } catch { setStatus("error"); setMessage("Network error. Try again."); }
  }

  return (
    <>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');*{font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}::selection{background:rgba(255,107,107,0.2)}`}</style>

      <main style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', overflow: 'hidden', position: 'relative' }}>
        {/* Animated gradient orbs */}
        <motion.div style={{ position: 'absolute', top: '-20%', right: '-15%', width: 700, height: 700, borderRadius: '50%', opacity: 0.4, pointerEvents: 'none', background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 50%)' }} animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: 500, height: 500, borderRadius: '50%', opacity: 0.25, pointerEvents: 'none', background: 'radial-gradient(circle, rgba(255,150,100,0.12) 0%, transparent 50%)' }} animate={{ scale: [1, 1.1, 1], x: [0, 15, 0], y: [0, 15, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }} />

        {/* Floating particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div key={i} style={{ position: 'absolute', width: 4, height: 4, background: '#ff6b6b', borderRadius: '50%', pointerEvents: 'none', left: `${20 + i * 20}%`, top: `${30 + (i % 2) * 30}%` }} animate={{ y: [0, -30, 0], opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }} />
        ))}

        {/* Nav */}
        <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: smooth, delay: 0.1 }} style={{ position: 'relative', zIndex: 20, padding: 24 }}>
          <div style={{ maxWidth: 896, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', textDecoration: 'none' }}>
              <Image src="/APEX-Final-White.svg?v=100" alt="APEX" width={28} height={28} style={{ height: 28, width: 28 }} priority unoptimized />
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.025em' }}>APEX</span>
            </Link>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <StepIndicator currentStep={step} totalSteps={totalSteps} />
            </motion.div>
          </div>
        </motion.nav>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 10, padding: '32px 24px 96px' }}>
          <div style={{ maxWidth: 672, margin: '0 auto' }}>
            {/* Back button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: smooth, delay: 0.2 }}>
              {step > 0 && status !== "sent" ? (
                <button onClick={() => setStep(step - 1)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a1a1aa', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 32, fontSize: 14 }}>
                  <ArrowLeft style={{ width: 16, height: 16 }} />Back
                </button>
              ) : (
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a1a1aa', textDecoration: 'none', marginBottom: 32, fontSize: 14 }}>
                  <ArrowLeft style={{ width: 16, height: 16 }} />Home
                </Link>
              )}
            </motion.div>

            {/* Success state */}
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: smooth }} style={{ paddingTop: 48, paddingBottom: 48 }}>
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }} style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 32px' }}>
                    <div style={{ width: 80, height: 80, background: '#ff6b6b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}>
                        <Check style={{ width: 40, height: 40, color: 'white' }} strokeWidth={3} />
                      </motion.div>
                    </div>
                  </motion.div>
                  <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smooth, delay: 0.4 }} style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', textAlign: 'center', margin: 0 }}>Application received</motion.h1>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smooth, delay: 0.5 }} style={{ marginTop: 16, color: '#a1a1aa', fontSize: 18, textAlign: 'center', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>We'll review your application and reach out if you're approved.</motion.p>
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smooth, delay: 0.6 }} style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
                    {[{ num: "1", title: "Review", desc: "5-7 business days" }, { num: "2", title: "Decision", desc: "Email notification" }, { num: "3", title: "Enrollment", desc: "Access & onboarding" }].map((item, i) => (
                      <motion.div key={item.num} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: smooth, delay: 0.7 + i * 0.1 }} style={{ textAlign: 'center', padding: 20 }}>
                        <div style={{ width: 56, height: 56, background: '#27272a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                          <span style={{ color: '#ff6b6b', fontSize: 20, fontWeight: 700 }}>{item.num}</span>
                        </div>
                        <h3 style={{ color: 'white', fontWeight: 600, fontSize: 18, margin: 0 }}>{item.title}</h3>
                        <p style={{ color: '#71717a', fontSize: 14, marginTop: 4 }}>{item.desc}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: smooth, delay: 0.9 }} style={{ marginTop: 32, textAlign: 'center' }}>
                    <p style={{ color: '#52525b', fontSize: 14, margin: 0 }}>Confirmation sent to <span style={{ color: '#a1a1aa' }}>{formData.email}</span></p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smooth, delay: 1 }} style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#ff6b6b', color: 'white', fontWeight: 500, padding: '16px 32px', borderRadius: 100, textDecoration: 'none' }}>
                      Back to home<ArrowRight style={{ width: 16, height: 16 }} />
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Header */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: smooth, delay: 0.3 }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <motion.span style={{ width: 8, height: 8, background: '#ff6b6b', borderRadius: '50%' }} animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                    <span style={{ color: '#71717a', fontSize: 14 }}>Step {step + 1} of {totalSteps}</span>
                  </motion.div>

                  <motion.h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: smooth, delay: 0.4 }}>
                    {step === 0 && "Let's get started"}
                    {step === 1 && "Show us your work"}
                    {step === 2 && "Tell us your story"}
                  </motion.h1>
                  <motion.p style={{ marginTop: 16, color: '#a1a1aa', fontSize: 18 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: smooth, delay: 0.5 }}>
                    {step === 0 && "Basic information to get your application started."}
                    {step === 1 && "Upload your resume and any relevant documents."}
                    {step === 2 && "Help us understand why APEX is right for you."}
                  </motion.p>

                  {/* Form */}
                  <form onSubmit={onSubmit} style={{ marginTop: 40 }}>
                    <AnimatePresence mode="wait">
                      {/* Step 1 */}
                      {step === 0 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5, ease: smooth }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                            <InputField label="Full name" name="name" placeholder="Your name" required value={formData.name} onChange={(v) => updateField("name", v)} onBlur={() => handleBlur("name")} error={touched.name ? errors.name : null} />
                            <InputField label="Email" name="email" type="email" placeholder="you@email.com" required value={formData.email} onChange={(v) => updateField("email", v)} onBlur={() => handleBlur("email")} error={touched.email ? errors.email : null} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                            <InputField label="Phone number" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(v) => updateField("phone", v)} onBlur={() => handleBlur("phone")} error={touched.phone ? errors.phone : null} />
                            <SelectField label="Track" name="track" options={["Data Analyst"]} required value={formData.track} onChange={(v) => updateField("track", v)} />
                          </div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smooth }} style={{ paddingTop: 16, borderTop: '1px solid rgba(39,39,42,0.5)' }}>
                            <p style={{ fontSize: 14, color: '#71717a', marginBottom: 16 }}>Current situation</p>
                          </motion.div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                            <SelectField label="Current status" name="currentStatus" options={["High School Student", "College Student", "Recent Graduate", "Working Professional", "Career Changer", "Other"]} required value={formData.currentStatus} onChange={(v) => updateField("currentStatus", v)} />
                            <InputField label="School / University" name="school" placeholder="Current or most recent" value={formData.school} onChange={(v) => updateField("school", v)} onBlur={() => handleBlur("school")} error={touched.school ? errors.school : null} />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2 */}
                      {step === 1 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5, ease: smooth }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                          <FileUpload label="Resume / CV" name="resume" accept=".pdf,.doc,.docx" hint="PDF or Word document, max 10MB" file={resumeFile} onFileChange={(file) => { setResumeFile(file); if (file) setErrors((prev) => ({ ...prev, resume: null })); }} required error={errors.resume} />
                          <FileUpload label="SAT / ACT Score Report" name="satScore" accept=".pdf,.png,.jpg,.jpeg" hint="PDF or image of your score report, max 10MB" file={satScoreFile} onFileChange={setSatScoreFile} />
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ paddingTop: 16, borderTop: '1px solid rgba(39,39,42,0.5)' }}>
                            <p style={{ fontSize: 14, color: '#71717a', marginBottom: 16 }}>Online presence (optional)</p>
                          </motion.div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                            <InputField label="LinkedIn" name="linkedin" placeholder="linkedin.com/in/yourname" value={formData.linkedin} onChange={(v) => updateField("linkedin", v)} onBlur={() => handleBlur("linkedin")} error={touched.linkedin ? errors.linkedin : null} />
                            <InputField label="Portfolio / GitHub" name="portfolio" placeholder="github.com/yourname" value={formData.portfolio} onChange={(v) => updateField("portfolio", v)} onBlur={() => handleBlur("portfolio")} error={touched.portfolio ? errors.portfolio : null} />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3 */}
                      {step === 2 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5, ease: smooth }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                          <SelectField label="How did you hear about APEX?" name="hearAbout" options={["Social Media", "Friend / Family", "Search Engine", "News Article", "Podcast", "Other"]} value={formData.hearAbout} onChange={(v) => updateField("hearAbout", v)} />
                          <TextareaField label="Why APEX?" name="why" placeholder="Tell us what you're trying to accomplish and why APEX is the right path for you. What draws you to learning through real challenges rather than traditional education?" required rows={5} value={formData.why} onChange={(v) => updateField("why", v)} onBlur={() => handleBlur("why")} error={touched.why ? errors.why : null} hint="50-200 words" />
                          <TextareaField label="Where do you see yourself in 5 years?" name="goals" placeholder="What kind of work do you want to be doing? What impact do you want to have? We want to understand your long-term vision." rows={4} value={formData.goals} onChange={(v) => updateField("goals", v)} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: smooth }} style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                      {step < totalSteps - 1 ? (
                        <motion.button type="button" onClick={handleNextStep} disabled={!canProceed()} whileHover={{ scale: canProceed() ? 1.02 : 1 }} whileTap={{ scale: canProceed() ? 0.98 : 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#ff6b6b', color: 'white', fontWeight: 500, padding: '16px 32px', borderRadius: 100, border: 'none', cursor: canProceed() ? 'pointer' : 'not-allowed', opacity: canProceed() ? 1 : 0.4, transition: 'opacity 0.3s ease' }}>
                          Continue<ArrowRight style={{ width: 16, height: 16 }} />
                        </motion.button>
                      ) : (
                        <motion.button type="submit" disabled={status === "sending" || !canProceed()} whileHover={{ scale: canProceed() && status !== "sending" ? 1.02 : 1 }} whileTap={{ scale: canProceed() && status !== "sending" ? 0.98 : 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#ff6b6b', color: 'white', fontWeight: 500, padding: '16px 32px', borderRadius: 100, border: 'none', cursor: canProceed() && status !== "sending" ? 'pointer' : 'not-allowed', opacity: canProceed() ? 1 : 0.4, transition: 'opacity 0.3s ease' }}>
                          {status === "sending" ? (<><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />Submitting...</>) : (<>Submit application<ArrowRight style={{ width: 16, height: 16 }} /></>)}
                        </motion.button>
                      )}
                      {step < totalSteps - 1 && <span style={{ color: '#52525b', fontSize: 14 }}>Press Enter ↵</span>}
                    </motion.div>

                    {/* Error message */}
                    <AnimatePresence>
                      {status === "error" && message && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', fontSize: 14 }}>
                          <X style={{ width: 16, height: 16 }} />{message}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>

                  {/* Footer note */}
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ marginTop: 48, fontSize: 12, color: '#52525b' }}>
                    By submitting, you agree that we can contact you about APEX. Your information is kept confidential.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom line */}
        <motion.div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: '#27272a' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, ease: smooth, delay: 0.5 }} />
      </main>
    </>
  );
}