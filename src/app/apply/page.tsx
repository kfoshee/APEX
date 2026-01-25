"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, Check, X, FileText, Loader2, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const smooth: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: smooth, delay },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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
    if (!value) return null; // Optional field
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(value)) return "Please enter a valid phone number";
    return null;
  },
  linkedin: (value: string) => {
    if (!value) return null; // Optional field
    if (!value.includes("linkedin.com/") && !value.startsWith("linkedin.com")) {
      return "Please enter a valid LinkedIn URL";
    }
    return null;
  },
  portfolio: (value: string) => {
    if (!value) return null; // Optional field
    // Basic URL validation
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
    if (!value) return null; // Optional
    if (value.length < 2) return "Please enter a valid school name";
    return null;
  },
};

// Form step indicator
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i < currentStep ? "bg-[#ff6b6b] w-8" : i === currentStep ? "bg-[#ff6b6b] w-12" : "bg-zinc-800 w-8"
          }`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: smooth }}
        />
      ))}
    </div>
  );
}

// File upload component
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-sm text-zinc-300 mb-2">
        {label} {required && <span className="text-[#ff6b6b]">*</span>}
      </label>
      <motion.div
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-colors duration-300 ${
          error
            ? "border-red-500/50 bg-red-500/5"
            : isDragging
            ? "border-[#ff6b6b] bg-[#ff6b6b]/5"
            : "border-zinc-800 hover:border-zinc-700"
        } ${file ? "bg-zinc-900/50" : "bg-zinc-900/30"}`}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
        <div className="p-8 text-center">
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center gap-3"
              >
                <div className="w-10 h-10 bg-[#ff6b6b]/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#ff6b6b]" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-zinc-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileChange(null);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="ml-2 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Upload className="w-5 h-5 text-zinc-400" />
                </motion.div>
                <p className="text-zinc-400 text-sm">
                  <span className="text-[#ff6b6b] font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-zinc-600 text-xs mt-1">{hint}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 text-sm text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// Input field component
function InputField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  error,
  onBlur,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  onBlur?: () => void;
}) {
  return (
    <motion.div variants={staggerItem}>
      <label className="block text-sm text-zinc-300 mb-2">
        {label} {required && <span className="text-[#ff6b6b]">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl bg-zinc-900 border px-4 py-3.5 outline-none transition-colors duration-300 text-white placeholder:text-zinc-600 ${
          error ? "border-red-500/50 focus:border-red-500" : "border-zinc-800 focus:border-[#ff6b6b]"
        }`}
        placeholder={placeholder}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 text-sm text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Select field component
function SelectField({
  label,
  name,
  options,
  required = false,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <motion.div variants={staggerItem}>
      <label className="block text-sm text-zinc-300 mb-2">
        {label} {required && <span className="text-[#ff6b6b]">*</span>}
      </label>
      <select
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3.5 outline-none focus:border-[#ff6b6b] transition-colors duration-300 text-white appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
          backgroundSize: "1.25rem",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </motion.div>
  );
}

// Textarea field component
function TextareaField({
  label,
  name,
  placeholder,
  required = false,
  rows = 4,
  value,
  onChange,
  error,
  onBlur,
  hint,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  onBlur?: () => void;
  hint?: string;
}) {
  return (
    <motion.div variants={staggerItem}>
      <label className="block text-sm text-zinc-300 mb-2">
        {label} {required && <span className="text-[#ff6b6b]">*</span>}
      </label>
      <textarea
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl bg-zinc-900 border px-4 py-3.5 outline-none transition-colors duration-300 text-white placeholder:text-zinc-600 resize-none ${
          error ? "border-red-500/50 focus:border-red-500" : "border-zinc-800 focus:border-[#ff6b6b]"
        }`}
        placeholder={placeholder}
      />
      <div className="flex justify-between items-center mt-1">
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm text-red-400 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {hint && !error && (
          <p className="text-xs text-zinc-600 ml-auto">{hint}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function ApplyPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    track: "Data Analyst",
    currentStatus: "Student",
    school: "",
    linkedin: "",
    portfolio: "",
    hearAbout: "Social Media",
    why: "",
    goals: "",
  });

  // Error state
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [satScoreFile, setSatScoreFile] = useState<File | null>(null);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
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

      setErrors({
        ...errors,
        name: nameError,
        email: emailError,
        phone: phoneError,
        school: schoolError,
      });

      setTouched({
        ...touched,
        name: true,
        email: true,
        phone: true,
        school: true,
      });

      return !nameError && !emailError && !phoneError && !schoolError;
    }
    if (stepIndex === 1) {
      const linkedinError = validators.linkedin(formData.linkedin);
      const portfolioError = validators.portfolio(formData.portfolio);
      
      setErrors({
        ...errors,
        linkedin: linkedinError,
        portfolio: portfolioError,
      });

      setTouched({
        ...touched,
        linkedin: true,
        portfolio: true,
      });

      if (!resumeFile) {
        setErrors((prev) => ({ ...prev, resume: "Resume is required" }));
        return false;
      }
      
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
    if (step === 0) {
      return formData.name && formData.email && !errors.name && !errors.email;
    }
    if (step === 1) {
      return resumeFile !== null && !errors.linkedin && !errors.portfolio;
    }
    const wordCount = formData.why.trim().split(/\s+/).filter(word => word.length > 0).length;
    return wordCount >= 50 && wordCount <= 200 && !errors.why;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    setStatus("sending");
    setMessage("");

    // Create FormData for file upload
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    if (resumeFile) form.append("resume", resumeFile);
    if (satScoreFile) form.append("satScore", satScoreFile);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Something went wrong. Try again.");
        return;
      }
      setStatus("sent");
      setMessage("Application received. We'll follow up soon.");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

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

      <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-[-20%] right-[-15%] w-[700px] h-[700px] rounded-full opacity-40 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 50%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,150,100,0.12) 0%, transparent 50%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 15, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Floating particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#ff6b6b] rounded-full pointer-events-none"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: smooth, delay: 0.1 }}
          className="relative z-20 px-6 py-6"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white">
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
            </Link>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <StepIndicator currentStep={step} totalSteps={totalSteps} />
            </motion.div>
          </div>
        </motion.nav>

        {/* Main content */}
        <div className="relative z-10 px-6 pt-8 pb-24">
          <div className="max-w-2xl mx-auto">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: smooth, delay: 0.2 }}
            >
              {step > 0 && status !== "sent" ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300 mb-8 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back
                </button>
              ) : (
                <Link
                  href="/"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300 mb-8 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  Home
                </Link>
              )}
            </motion.div>

            {/* Success state - Thank You Page */}
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: smooth }}
                  className="py-12"
                >
                  {/* Animated checkmark */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="relative w-20 h-20 mx-auto mb-8"
                  >
                    <div className="w-20 h-20 bg-[#ff6b6b] rounded-full flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                      >
                        <Check className="w-10 h-10 text-white" strokeWidth={3} />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Main heading */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: smooth, delay: 0.4 }}
                    className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-center"
                  >
                    Application received
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: smooth, delay: 0.5 }}
                    className="mt-4 text-zinc-400 text-lg text-center max-w-md mx-auto"
                  >
                    We'll review your application and reach out if you're approved.
                  </motion.p>

                  {/* Horizontal steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: smooth, delay: 0.6 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
                  >
                    {[
                      { num: "1", title: "Review", desc: "5-7 business days" },
                      { num: "2", title: "Decision", desc: "Email notification" },
                      { num: "3", title: "Enrollment", desc: "Access & onboarding" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.num}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: smooth, delay: 0.7 + i * 0.1 }}
                        className="text-center p-5"
                      >
                        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-[#ff6b6b] text-sm font-bold">{item.num}</span>
                        </div>
                        <h3 className="text-white font-medium text-sm">{item.title}</h3>
                        <p className="text-zinc-500 text-xs mt-1">{item.desc}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Email confirmation note */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: smooth, delay: 0.9 }}
                    className="mt-8 text-center"
                  >
                    <p className="text-zinc-600 text-sm">
                      Confirmation sent to <span className="text-zinc-400">{formData.email}</span>
                    </p>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: smooth, delay: 1 }}
                    className="mt-10 flex justify-center"
                  >
                    <Link
                      href="/"
                      className="group inline-flex items-center justify-center gap-2 bg-[#ff6b6b] text-white font-medium px-8 py-4 rounded-full hover:bg-[#ff5a5a] transition-colors duration-300"
                    >
                      Back to home
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Header */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    custom={0}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, ease: smooth, delay: 0.3 }}
                      className="flex items-center gap-3 mb-4"
                    >
                      <motion.span
                        className="w-2 h-2 bg-[#ff6b6b] rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <span className="text-zinc-500 text-sm">
                        Step {step + 1} of {totalSteps}
                      </span>
                    </motion.div>

                    <motion.h1
                      className="text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1]"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, ease: smooth, delay: 0.4 }}
                    >
                      {step === 0 && "Let's get started"}
                      {step === 1 && "Show us your work"}
                      {step === 2 && "Tell us your story"}
                    </motion.h1>
                    <motion.p
                      className="mt-4 text-zinc-400 text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, ease: smooth, delay: 0.5 }}
                    >
                      {step === 0 && "Basic information to get your application started."}
                      {step === 1 && "Upload your resume and any relevant documents."}
                      {step === 2 && "Help us understand why APEX is right for you."}
                    </motion.p>
                  </motion.div>

                  {/* Form */}
                  <form onSubmit={onSubmit} className="mt-10">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Basic Info */}
                      {step === 0 && (
                        <motion.div
                          key="step1"
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: -50 }}
                          variants={staggerContainer}
                          className="space-y-5"
                        >
                          <div className="grid md:grid-cols-2 gap-5">
                            <InputField
                              label="Full name"
                              name="name"
                              placeholder="Your name"
                              required
                              value={formData.name}
                              onChange={(v) => updateField("name", v)}
                              onBlur={() => handleBlur("name")}
                              error={touched.name ? errors.name : null}
                            />
                            <InputField
                              label="Email"
                              name="email"
                              type="email"
                              placeholder="you@email.com"
                              required
                              value={formData.email}
                              onChange={(v) => updateField("email", v)}
                              onBlur={() => handleBlur("email")}
                              error={touched.email ? errors.email : null}
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-5">
                            <InputField
                              label="Phone number"
                              name="phone"
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              value={formData.phone}
                              onChange={(v) => updateField("phone", v)}
                              onBlur={() => handleBlur("phone")}
                              error={touched.phone ? errors.phone : null}
                            />
                            <SelectField
                              label="Track"
                              name="track"
                              options={["Data Analyst"]}
                              required
                              value={formData.track}
                              onChange={(v) => updateField("track", v)}
                            />
                          </div>

                          <motion.div
                            variants={staggerItem}
                            className="pt-4 border-t border-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500 mb-4">Current situation</p>
                          </motion.div>

                          <div className="grid md:grid-cols-2 gap-5">
                            <SelectField
                              label="Current status"
                              name="currentStatus"
                              options={[
                                "High School Student",
                                "College Student",
                                "Recent Graduate",
                                "Working Professional",
                                "Career Changer",
                                "Other",
                              ]}
                              required
                              value={formData.currentStatus}
                              onChange={(v) => updateField("currentStatus", v)}
                            />
                            <InputField
                              label="School / University"
                              name="school"
                              placeholder="Current or most recent"
                              value={formData.school}
                              onChange={(v) => updateField("school", v)}
                              onBlur={() => handleBlur("school")}
                              error={touched.school ? errors.school : null}
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Documents */}
                      {step === 1 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5, ease: smooth }}
                          className="space-y-6"
                        >
                          <FileUpload
                            label="Resume / CV"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            hint="PDF or Word document, max 10MB"
                            file={resumeFile}
                            onFileChange={(file) => {
                              setResumeFile(file);
                              if (file) {
                                setErrors((prev) => ({ ...prev, resume: null }));
                              }
                            }}
                            required
                            error={errors.resume}
                          />

                          <FileUpload
                            label="SAT / ACT Score Report"
                            name="satScore"
                            accept=".pdf,.png,.jpg,.jpeg"
                            hint="PDF or image of your score report, max 10MB"
                            file={satScoreFile}
                            onFileChange={setSatScoreFile}
                          />

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="pt-4 border-t border-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500 mb-4">Online presence (optional)</p>
                          </motion.div>

                          <div className="grid md:grid-cols-2 gap-5">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <InputField
                                label="LinkedIn"
                                name="linkedin"
                                placeholder="linkedin.com/in/yourname"
                                value={formData.linkedin}
                                onChange={(v) => updateField("linkedin", v)}
                                onBlur={() => handleBlur("linkedin")}
                                error={touched.linkedin ? errors.linkedin : null}
                              />
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              <InputField
                                label="Portfolio / GitHub"
                                name="portfolio"
                                placeholder="github.com/yourname"
                                value={formData.portfolio}
                                onChange={(v) => updateField("portfolio", v)}
                                onBlur={() => handleBlur("portfolio")}
                                error={touched.portfolio ? errors.portfolio : null}
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Essay */}
                      {step === 2 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5, ease: smooth }}
                          className="space-y-6"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <SelectField
                              label="How did you hear about APEX?"
                              name="hearAbout"
                              options={[
                                "Social Media",
                                "Friend / Family",
                                "Search Engine",
                                "News Article",
                                "Podcast",
                                "Other",
                              ]}
                              value={formData.hearAbout}
                              onChange={(v) => updateField("hearAbout", v)}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <TextareaField
                              label="Why APEX?"
                              name="why"
                              placeholder="Tell us what you're trying to accomplish and why APEX is the right path for you. What draws you to learning through real challenges rather than traditional education?"
                              required
                              rows={5}
                              value={formData.why}
                              onChange={(v) => updateField("why", v)}
                              onBlur={() => handleBlur("why")}
                              error={touched.why ? errors.why : null}
                              hint="50-200 words"
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <TextareaField
                              label="Where do you see yourself in 5 years?"
                              name="goals"
                              placeholder="What kind of work do you want to be doing? What impact do you want to have? We want to understand your long-term vision."
                              rows={4}
                              value={formData.goals}
                              onChange={(v) => updateField("goals", v)}
                            />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8, ease: smooth }}
                      className="mt-10 flex flex-col sm:flex-row items-center gap-4"
                    >
                      {step < totalSteps - 1 ? (
                        <motion.button
                          type="button"
                          onClick={handleNextStep}
                          disabled={!canProceed()}
                          whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                          whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                          className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-[#ff6b6b] text-white font-medium px-8 py-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-300"
                        >
                          Continue
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.button>
                      ) : (
                        <motion.button
                          type="submit"
                          disabled={status === "sending" || !canProceed()}
                          whileHover={{ scale: canProceed() && status !== "sending" ? 1.02 : 1 }}
                          whileTap={{ scale: canProceed() && status !== "sending" ? 0.98 : 1 }}
                          className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-[#ff6b6b] text-white font-medium px-8 py-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-300"
                        >
                          {status === "sending" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit application
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </>
                          )}
                        </motion.button>
                      )}

                      {step < totalSteps - 1 && (
                        <span className="text-zinc-600 text-sm">
                          Press Enter ↵
                        </span>
                      )}
                    </motion.div>

                    {/* Error message */}
                    <AnimatePresence>
                      {status === "error" && message && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-4 flex items-center gap-2 text-red-400 text-sm"
                        >
                          <X className="w-4 h-4" />
                          {message}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>

                  {/* Footer note */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-xs text-zinc-600"
                  >
                    By submitting, you agree that we can contact you about APEX. Your information is kept confidential.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom decorative line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-zinc-800"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: smooth, delay: 0.5 }}
          style={{ originX: 0 }}
        />
      </main>
    </>
  );
}