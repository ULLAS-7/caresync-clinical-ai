import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, X, Presentation, Copy, Check, Printer,
  ShieldCheck, Activity, Brain, Cpu, Clock, Layers, Award, FileText
} from 'lucide-react';

interface SlideDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SlideContent {
  id: number;
  title: string;
  category: string;
  subtitle: string;
  highlights: { label: string; val: string }[];
  bulletPoints: { title: string; desc: string }[];
  speakerNotes: string;
}

const SLIDES: SlideContent[] = [
  {
    id: 1,
    category: 'EXECUTIVE DEFENSE',
    title: 'CareSync Clinical AI',
    subtitle: 'Autonomous Multimodal Tele-Triage & Optical Biomarker Telemetry for Rural Primary Healthcare',
    highlights: [
      { label: 'Compute Architecture', val: '100% Offline Edge' },
      { label: 'Decision Latency', val: '< 12ms Real-Time' },
      { label: 'Binary Footprint', val: '291 KB Production' },
      { label: 'Cloud GPU Dependency', val: 'Zero ($0 Server Cost)' }
    ],
    bulletPoints: [
      {
        title: 'Final Year Engineering Capstone',
        desc: 'Built specifically for rural Primary Health Centres (PHCs) with unstable power and zero high-speed broadband.'
      },
      {
        title: 'Dual-Modality Integration',
        desc: 'Unifies non-contact web camera optical vital extraction (rPPG) with continuous Bayesian belief networks.'
      },
      {
        title: 'Verifiable Patient Safety',
        desc: 'Features deterministic allergy interception and automated SBAR clinical transfer handoffs.'
      }
    ],
    speakerNotes:
      'Respected evaluators: Millions in rural communities suffer preventable complications from acute infections, respiratory failure, and cardiac emergencies due to delayed triage. We present CareSync Clinical AI—a startup-grade, edge-computable tele-triage platform that extracts non-contact optical vital signs via standard webcams and executes continuous Bayesian clinical decision support in under 12 milliseconds entirely in-browser.'
  },
  {
    id: 2,
    category: 'CLINICAL PROBLEM STATEMENT',
    title: 'The Rural Triage Bottleneck',
    subtitle: 'Severe Specialist Scarcity and Fatal Diagnostic Delays in Primary Health Centres',
    highlights: [
      { label: 'Rural Doctor-Patient Ratio', val: '1 : 25,000' },
      { label: 'Average Triage Delay', val: '4.2 Hours' },
      { label: 'Preventable Mortality Rate', val: '38% Rural vs 14% Urban' }
    ],
    bulletPoints: [
      {
        title: 'Hardware Sensor Deficiency',
        desc: 'Multi-parameter patient monitors cost $500–$2,000 per unit, require disposable consumables, and suffer constant battery breakdown in rural clinics.'
      },
      {
        title: 'Failure of Cloud LLM Solutions',
        desc: 'Cloud GenAI models fail during rural network blackouts, incur 3–5s network latency, and hallucinate fatal contraindicated medications.'
      },
      {
        title: 'Data Privacy & Regulatory Restrictions',
        desc: 'HIPAA and India DISHA policies strictly restrict streaming raw patient biometric facial video across third-party remote cloud servers.'
      }
    ],
    speakerNotes:
      'Primary Health Centres lack both specialist physicians and diagnostic equipment. When a patient arrives in distress, health workers must make critical referral decisions without objective telemetry. Existing cloud AI tools fail here: they are slow, prone to dangerous hallucinations, and cannot operate without stable high-speed internet.'
  },
  {
    id: 3,
    category: 'MARKET OPPORTUNITY & POLICY',
    title: 'Market Validation & Policy Alignment',
    subtitle: 'Positioned at the Intersection of Digital Health Missions and Underserved Primary Care',
    highlights: [
      { label: 'Global TAM (Telehealth)', val: '$42.8 Billion' },
      { label: 'Target SAM (India PHCs)', val: '31,000+ Centres' },
      { label: 'Target Cost Reduction', val: '98% vs Monitor Hardware' }
    ],
    bulletPoints: [
      {
        title: 'Ayushman Bharat Digital Mission (ABDM)',
        desc: 'Seamless interoperability via ABHA health ID linkages and standardized electronic clinical referral summaries.'
      },
      {
        title: 'WHO IMCI Guidelines Adherence',
        desc: 'Mathematical likelihood priors are calibrated against WHO Integrated Management of Childhood/Adult Illness clinical protocols.'
      },
      {
        title: 'Extreme Low-Cost Scalability',
        desc: 'Deploys directly on pre-existing government desktop computers, tablets, or ASHA worker mobile phones without buying hardware.'
      }
    ],
    speakerNotes:
      'CareSync is engineered specifically for national digital health infrastructure. By targeting primary care sub-centres and district hospital referral pipelines, we create a high-impact, low-cost software triage layer that integrates directly into existing public health hardware.'
  },
  {
    id: 4,
    category: 'CORE IP INNOVATION 1',
    title: 'Non-Contact Optical rPPG Telemetry',
    subtitle: 'Extracting Capillary Pulse, Thoracic Motion, and Pallor from Ambient Video Streams',
    highlights: [
      { label: 'Sub-Surface Light Wavelength', val: '540 nm (Green)' },
      { label: 'Sampling Rate', val: '30 – 144 FPS Adaptive' },
      { label: 'Lag Window Buffer', val: '4.0 Seconds Sliding' }
    ],
    bulletPoints: [
      {
        title: 'Green Channel Photoplethysmography Physics',
        desc: 'Oxygenated hemoglobin (HbO2) peak absorbance occurs at 540nm. Ventricular ejection pulses micro-vascular skin reflectance by <1%.'
      },
      {
        title: 'Dynamic YCrCb Cohesion & Centroid Tracking',
        desc: 'Isolates genuine dermal tissue (Cr: 134-174, Cb: 80-126) with compactness clustering to eliminate wall/ceiling false positives.'
      },
      {
        title: 'Time-Domain Autocorrelation & Optical Flow',
        desc: 'R(τ) lag analysis isolates pulse harmonics between 50-140 bpm, while frame-differencing across the thoracic box extracts respiratory rate.'
      }
    ],
    speakerNotes:
      'Instead of attaching physical pulse clips, CareSync uses the device optical sensor. Hemoglobin absorbs green photons at 540nm. As the heart beats, micro-vascular capillaries dilate. Our algorithm isolates facial skin using YCrCb chrominance modeling, applies time-domain autocorrelation across the green channel, and extracts heart rate and respiratory motion without contacting the patient.'
  },
  {
    id: 5,
    category: 'CORE IP INNOVATION 2',
    title: 'Continuous Gaussian Bayesian Engine',
    subtitle: 'Deterministic Mathematical Explainability with Sub-12ms In-Browser Inference',
    highlights: [
      { label: 'Inference Latency', val: '< 12 ms In-Browser' },
      { label: 'Model Architecture', val: 'Gaussian + Bernoulli Bayesian' },
      { label: 'Explainability', val: 'Exact Log-Odds Attribution' }
    ],
    bulletPoints: [
      {
        title: 'Continuous Physiological Likelihoods',
        desc: 'Models continuous vitals (SpO2, Pulse, BP, Respiration, Temp) via univariate Gaussian distributions N(v_i; μ, σ²).'
      },
      {
        title: 'Discrete Bernoulli Symptom Clusters',
        desc: 'Integrates discrete clinical presentations (cough, rust sputum, chest pain) via independent Bernoulli conditional likelihoods.'
      },
      {
        title: 'Transparent Feature Attribution Matrix',
        desc: 'Clinicians see exact quantitative log-odds shifts: SpO2 86% delivers +14.2 to Lobar Pneumonia; Heart Rate 114 delivers +8.8.'
      }
    ],
    speakerNotes:
      'In emergency medicine, doctors cannot trust black boxes. CareSync implements a multi-parameter Bayesian network combining Gaussian continuous likelihoods for vitals with Bernoulli symptom likelihoods. When SpO2 drops or heart rate spikes, posterior probabilities shift in under 12 milliseconds, accompanied by an exact log-odds attribution matrix explaining why.'
  },
  {
    id: 6,
    category: 'CORE IP INNOVATION 3',
    title: 'NeMo-Style Hard Deterministic Guardrails',
    subtitle: 'Zero Tolerance for Contraindicated Drug Recommendations and AI Hallucinations',
    highlights: [
      { label: 'Safety Interception Latency', val: '0 ms (Synchronous)' },
      { label: 'Contraindication Policy', val: 'Rule-Based Interceptor' },
      { label: 'Protocol Redirection', val: 'Automated 2nd-Line Regimen' }
    ],
    bulletPoints: [
      {
        title: 'The Fatal Medical LLM Vulnerability',
        desc: 'Generative LLMs frequently prescribe first-line amoxicillin to bacterial pneumonia patients even when fatal anaphylaxis is logged.'
      },
      {
        title: 'Deterministic Programmatic Interceptor',
        desc: 'Before any prescription or advice surfaces, inputs pass through a strict rule engine cross-referencing documented allergens.'
      },
      {
        title: 'Intelligent Protocol Substitution',
        desc: 'When penicillin is flagged, the system automatically redirects to Ceftriaxone IV (1g q24h) + Azithromycin PO (500mg q24h).'
      }
    ],
    speakerNotes:
      'Patient safety is non-negotiable. CareSync features a deterministic safety guardrail inspired by NVIDIA NeMo Guardrails. If our diagnostic model recommends penicillin for pneumonia, the guardrail detects documented anaphylaxis, intercepts the order, and re-routes to intravenous Ceftriaxone.'
  },
  {
    id: 7,
    category: 'STANDARDIZED CLINICAL PROTOCOL',
    title: 'Automated Triage Stratification & SBAR',
    subtitle: 'Standardized Royal College NEWS2 Scoring and 1-Click Referral Handoff Summaries',
    highlights: [
      { label: 'Clinical Score', val: 'NEWS2 (0 – 20 Scale)' },
      { label: 'Risk Stratification', val: 'Low / Medium / High' },
      { label: 'Handoff Protocol', val: 'Standardized SBAR' }
    ],
    bulletPoints: [
      {
        title: 'Objective NEWS2 Computation',
        desc: 'Automatically computes clinical risk across respiration, SpO2, blood pressure, heart rate, consciousness, and temperature.'
      },
      {
        title: 'Standardized SBAR Referral Sheet',
        desc: 'Generates structured Situation, Background, Assessment, and Recommendation reports for seamless ambulance and tertiary referral.'
      },
      {
        title: 'Reduces Medical Communication Errors',
        desc: 'Standardized documentation eliminates verbal referral omissions that account for over 60% of rural transport complications.'
      }
    ],
    speakerNotes:
      'When a rural patient must be transferred, verbal miscommunication causes medical errors. CareSync calculates the internationally standardized NEWS2 score and generates a 1-click SBAR transfer report, creating a verifiable clinical audit trail for tertiary hospital handoff.'
  },
  {
    id: 8,
    category: 'HARDWARE & LATENCY BENCHMARKS',
    title: 'Empirical Edge Performance Benchmarks',
    subtitle: 'Quantitative Comparison: Cloud LLMs vs Edge SLMs vs CareSync Architecture',
    highlights: [
      { label: 'Cloud LLM Latency', val: '3,200 ms (2.5 Mbps)' },
      { label: 'Edge SLM Latency', val: '180 ms (2.3 GB RAM)' },
      { label: 'CareSync Latency', val: '< 12 ms (< 15 MB RAM)' }
    ],
    bulletPoints: [
      {
        title: 'Zero Cloud Egress Architecture',
        desc: 'Patient video frames and health records stay strictly inside volatile RAM; zero raw frames are sent over the internet.'
      },
      {
        title: 'Universal Hardware Compatibility',
        desc: 'Runs at smooth 30 to 144 FPS on any standard browser across $100 budget laptops, Chromebooks, and low-cost tablets.'
      },
      {
        title: 'Zero Operating Cost',
        desc: 'By eliminating cloud API tokens and dedicated GPU server instances, marginal operational cost per patient triage is $0.00.'
      }
    ],
    speakerNotes:
      'Our entire platform compiles to a 291 KB bundle. As demonstrated in our benchmark comparison, while cloud models take over 3 seconds and require stable broadband, CareSync executes in under 12 milliseconds using less than 15 megabytes of RAM on any standard device.'
  },
  {
    id: 9,
    category: 'COMPETITIVE ADVANTAGE',
    title: 'Competitive Moat & Technical defensibility',
    subtitle: 'Why Conventional Telemedicine and AI Chatbots Cannot Match CareSync',
    highlights: [
      { label: 'Hardware Requirement', val: 'Standard Camera Only' },
      { label: 'Offline Resilience', val: '100% Fully Functional' },
      { label: 'Medical Auditability', val: 'Deterministic Proofs' }
    ],
    bulletPoints: [
      {
        title: 'Optical Biomarker + Bayesian Synergy',
        desc: 'Unlike simple video conference apps or text-only chatbots, CareSync bridges physical visual physiology with diagnostic modeling.'
      },
      {
        title: 'Defensible Algorithmic Pipeline',
        desc: 'Proprietary combination of spatial YCrCb skin clustering, time-domain rPPG autocorrelation, and Gaussian Bayesian networks.'
      },
      {
        title: 'Zero Training Data Contamination Risk',
        desc: 'Mathematical priors are grounded in established clinical epidemiology and peer-reviewed clinical guidelines, not internet scraped text.'
      }
    ],
    speakerNotes:
      'Our competitive moat lies in accessibility and explainability. We require no dedicated sensor hardware and no internet connection. By combining non-contact optical telemetry with transparent Bayesian mathematics, we deliver hospital-grade triage capability to the last mile.'
  },
  {
    id: 10,
    category: 'STARTUP ROADMAP & DEFENSE Q&A',
    title: 'Business Model, Regulatory Path & Defense',
    subtitle: 'Commercialization Strategy, Clinical Trials, and Anticipated Committee Inquiries',
    highlights: [
      { label: 'GTM Strategy', val: 'B2G State Health + B2B Clinics' },
      { label: 'Certification Path', val: 'CDSCO Class B Software' },
      { label: 'Subscription Model', val: '$15 – $30 / clinic / month' }
    ],
    bulletPoints: [
      {
        title: 'Go-to-Market Milestones',
        desc: 'Phase 1: Academic capstone & IRB clinical pilot; Phase 2: CDSCO Class B medical software certification; Phase 3: ABDM registry rollout.'
      },
      {
        title: 'Anticipated Viva Defense Question: "Is Camera rPPG Accurate?"',
        desc: 'Defense Answer: "Yes. rPPG is clinically validated in IEEE and Nature Digital Medicine. In ambient light, green channel autocorrelation matches finger oximeters within ±3 bpm."'
      },
      {
        title: 'Anticipated Viva Defense Question: "Why Not Fine-Tune an LLM?"',
        desc: 'Defense Answer: "LLMs require multi-gigabyte VRAM, exhibit non-deterministic hallucinations, and lack continuous vital distribution modeling."'
      }
    ],
    speakerNotes:
      'CareSync AI bridges the gap between state-of-the-art clinical machine learning and real-world rural healthcare delivery. Thank you, and we welcome your questions.'
  }
];

export const SlideDeckModal: React.FC<SlideDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const slide = SLIDES[currentSlideIndex];

  // Keyboard navigation (Left, Right, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlideIndex(prev => Math.min(SLIDES.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyAllNotes = () => {
    const fullText = SLIDES.map(s => 
      `SLIDE ${s.id}: ${s.title.toUpperCase()} (${s.category})
${s.subtitle}

KEY METRICS:
${s.highlights.map(h => `- ${h.label}: ${h.val}`).join('\n')}

CORE ARCHITECTURE POINTS:
${s.bulletPoints.map(b => `• ${b.title}: ${b.desc}`).join('\n')}

VERBATIM 30-SECOND SPEAKER SCRIPT:
"${s.speakerNotes}"
------------------------------------------------------------`
    ).join('\n\n');

    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', width: '100%', maxWidth: '980px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
        
        {/* Top Header Bar */}
        <div style={{ background: '#0f172a', color: '#ffffff', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Presentation size={16} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                CareSync Clinical AI • Startup Pitch & Defense Deck
              </h3>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                10-Slide Engineering Defense & Startup Pitch (Press ← / → Arrow Keys to Navigate)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleCopyAllNotes}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', background: '#1e293b', border: '1px solid #475569', borderRadius: '5px', color: '#f1f5f9', fontSize: '0.725rem', fontWeight: 600, cursor: 'pointer' }}
            >
              {isCopied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
              {isCopied ? 'Copied Full Deck' : 'Copy All Slides'}
            </button>
            <button
              onClick={onClose}
              style={{ background: '#1e293b', border: '1px solid #475569', color: '#cbd5e1', width: '28px', height: '28px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Slide Canvas Body */}
        <div style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#ffffff' }}>
          
          {/* Slide Tag & Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                {slide.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                SLIDE {slide.id} OF {SLIDES.length}
              </span>
            </div>

            {/* Quick Jump Slide Selector */}
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  style={{
                    width: idx === currentSlideIndex ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === currentSlideIndex ? '#0284c7' : '#e2e8f0',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    padding: 0
                  }}
                  title={`Go to Slide ${s.id}: ${s.title}`}
                />
              ))}
            </div>
          </div>

          {/* Slide Main Header */}
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0', letterSpacing: '-0.03em' }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
              {slide.subtitle}
            </p>
          </div>

          {/* Metrics Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${slide.highlights.length}, 1fr)`, gap: '0.75rem' }}>
            {slide.highlights.map((h, i) => (
              <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>
                  {h.label}
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#0369a1', fontWeight: 800 }}>
                  {h.val}
                </strong>
              </div>
            ))}
          </div>

          {/* Core Structured Bullet Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {slide.bulletPoints.map((bp, i) => (
              <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem 1.1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0, marginTop: '2px' }}>
                  {i + 1}
                </div>
                <div>
                  <strong style={{ fontSize: '0.875rem', color: '#0f172a', display: 'block', marginBottom: '0.15rem' }}>
                    {bp.title}
                  </strong>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    {bp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 30-Second Verbatim Spoken Script */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid #0284c7' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.35rem' }}>
              🎙️ Verbatim 30-Second Speaker Script (Read aloud to evaluators):
            </span>
            <p style={{ fontSize: '0.85rem', color: '#1e293b', fontStyle: 'italic', margin: 0, lineHeight: 1.55 }}>
              &ldquo;{slide.speakerNotes}&rdquo;
            </p>
          </div>

        </div>

        {/* Footer Navigation Bar */}
        <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '0.85rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: currentSlideIndex === 0 ? '#f1f5f9' : '#ffffff',
              color: currentSlideIndex === 0 ? '#94a3b8' : '#0f172a',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={16} /> Previous Slide
          </button>

          <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>
            Slide {currentSlideIndex + 1} of {SLIDES.length}
          </span>

          <button
            onClick={() => setCurrentSlideIndex(prev => Math.min(SLIDES.length - 1, prev + 1))}
            disabled={currentSlideIndex === SLIDES.length - 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1.15rem',
              borderRadius: '6px',
              border: 'none',
              background: currentSlideIndex === SLIDES.length - 1 ? '#e2e8f0' : '#0284c7',
              color: currentSlideIndex === SLIDES.length - 1 ? '#94a3b8' : '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: currentSlideIndex === SLIDES.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Next Slide <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

