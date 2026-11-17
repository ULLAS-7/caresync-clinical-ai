import React from 'react';
import { PatientProfile, DifferentialDiagnosis } from '../types/clinical';
import { evaluateClinicalSafetyGuardrails } from '../engines/guardrailsEngine';
import { Cpu, ShieldAlert, CheckCircle2, AlertTriangle, Stethoscope, Pill, ListChecks, Zap } from 'lucide-react';

interface ClinicalReasoningViewProps {
  patient: PatientProfile;
  diagnoses: DifferentialDiagnosis[];
}

export const ClinicalReasoningView: React.FC<ClinicalReasoningViewProps> = ({
  patient,
  diagnoses
}) => {
  const primaryDiagnosis = diagnoses[0];
  const guardrailCheck = primaryDiagnosis ? evaluateClinicalSafetyGuardrails(patient, primaryDiagnosis) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Edge Inference Telemetry Banner */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Edge SLM Clinical Reasoning Engine
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Model: <strong>Llama-3.2-3B-Clinical-Instruct</strong> • Quantization: <strong>4-bit GGUF (Q4_K_M)</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.8rem' }}>
          <div>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>INFERENCE SPEED</span>
            <strong style={{ color: '#22c55e', fontSize: '1rem' }}>38.4 tokens/s</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>VRAM FOOTPRINT</span>
            <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>2.1 GB VRAM</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>PRIVACY & DATA</span>
            <strong style={{ color: '#a855f7', fontSize: '1rem' }}>100% Offline / Local</strong>
          </div>
        </div>
      </div>

      {/* NeMo Safety Guardrail Banner */}
      {guardrailCheck && (
        <div
          style={{
            background: guardrailCheck.alertType === 'CRITICAL_BLOCK' ? '#450a0a' : '#064e3b',
            border: guardrailCheck.alertType === 'CRITICAL_BLOCK' ? '1px solid #ef4444' : '1px solid #10b981',
            borderRadius: '0.75rem',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          {guardrailCheck.alertType === 'CRITICAL_BLOCK' ? (
            <AlertTriangle size={24} color="#f87171" />
          ) : (
            <ShieldAlert size={24} color="#34d399" />
          )}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: guardrailCheck.alertType === 'CRITICAL_BLOCK' ? '#fecaca' : '#a7f3d0', margin: 0 }}>
              NeMo Clinical Safety Guardrail Engine: {guardrailCheck.alertType}
            </h4>
            <p style={{ fontSize: '0.8rem', color: guardrailCheck.alertType === 'CRITICAL_BLOCK' ? '#fca5a5' : '#6ee7b7', margin: '0.2rem 0 0 0' }}>
              {guardrailCheck.message}
            </p>
          </div>
        </div>
      )}

      {/* Primary Diagnosis & Differentials */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Primary Diagnosis Card */}
        {primaryDiagnosis && (
          <div style={{ background: '#0f172a', border: '2px solid #0284c7', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 8px 30px rgba(2, 132, 199, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ padding: '0.2rem 0.5rem', borderRadius: '0.35rem', background: '#0369a1', color: '#e0f2fe', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Primary Clinical Diagnosis
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0.4rem 0 0.2rem 0' }}>
                  {primaryDiagnosis.disease}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                  ICD-10 Code: {primaryDiagnosis.icd10}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>PROBABILITY</span>
                <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>
                  {(primaryDiagnosis.probability * 100).toFixed(0)}%
                </strong>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.25rem', background: '#1e293b', padding: '0.75rem 1rem', borderRadius: '0.5rem', borderLeft: '3px solid #0284c7' }}>
              {primaryDiagnosis.rationale}
            </p>

            {/* First-Line Treatment Protocol */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Pill size={16} /> Immediate First-Line Treatment (Evidence-Based):
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {primaryDiagnosis.firstLineTreatment.map((rx, idx) => (
                  <div key={idx} style={{ padding: '0.45rem 0.75rem', background: '#1e293b', borderRadius: '0.4rem', fontSize: '0.8rem', color: '#f1f5f9', borderLeft: '3px solid #22c55e' }}>
                    {rx}
                  </div>
                ))}
              </div>
            </div>

            {/* Contraindications Warning */}
            {primaryDiagnosis.contraindications.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={16} /> Critical Contraindications & Warnings:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {primaryDiagnosis.contraindications.map((c, idx) => (
                    <div key={idx} style={{ padding: '0.45rem 0.75rem', background: '#450a0a', borderRadius: '0.4rem', fontSize: '0.78rem', color: '#fca5a5', border: '1px solid #7f1d1d' }}>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Secondary Differentials & Recommended Tests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Diagnostic Workup Checklist */}
          {primaryDiagnosis && (
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ListChecks size={18} color="#38bdf8" />
                Recommended Confirmatory Laboratory Workup
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {primaryDiagnosis.recommendedTests.map((test, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.75rem', background: '#1e293b', borderRadius: '0.4rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    <CheckCircle2 size={15} color="#06b6d4" />
                    <span>{test}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Differentials (Rank 2+) */}
          {diagnoses.length > 1 && (
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Stethoscope size={18} color="#f59e0b" />
                Alternative Differential Diagnoses Considered
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {diagnoses.slice(1).map((diff, idx) => (
                  <div key={idx} style={{ background: '#1e293b', borderRadius: '0.5rem', padding: '0.75rem 1rem', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{diff.disease}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>{(diff.probability * 100).toFixed(0)}%</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                      {diff.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

