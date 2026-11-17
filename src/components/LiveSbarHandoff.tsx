import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BayesianInferenceResult } from '../engines/bayesianEngine';
import { Printer, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';

interface LiveSbarHandoffProps {
  patientName: string;
  patientAge: number;
  patientLocation: string;
  vitals: {
    spO2: number;
    heartRate: number;
    bloodPressureSys: number;
    respiratoryRate: number;
    temperature: number;
    bloodGlucose: number;
  };
  activeSymptoms: string[];
  allergies: string[];
  topDiagnosis?: BayesianInferenceResult;
  news2Score: number;
  esiLevel: number;
}

export const LiveSbarHandoff: React.FC<LiveSbarHandoffProps> = ({
  patientName,
  patientAge,
  patientLocation,
  vitals,
  activeSymptoms,
  allergies,
  topDiagnosis,
  news2Score,
  esiLevel
}) => {
  const [physicianName, setPhysicianName] = useState('Dr. Ullas, MBBS (Medical Officer, PHC)');
  const [transferUrgency, setTransferUrgency] = useState<'IMMEDIATE_ICU' | 'TRANSFER_24H' | 'OPD_SPECIALIST'>(
    news2Score >= 7 ? 'IMMEDIATE_ICU' : news2Score >= 5 ? 'TRANSFER_24H' : 'OPD_SPECIALIST'
  );
  const [isExported, setIsExported] = useState(false);

  const handlePrint = () => {
    setIsExported(true);
    confetti({ particleCount: 75, spread: 60 });
    window.print();
  };

  const situation = `Patient ${patientName}, ${patientAge}yo presenting at ${patientLocation}. Evaluated as ESI Triage Level ${esiLevel} with NEWS2 Clinical Early Warning Score of ${news2Score}/20 (${news2Score >= 7 ? 'High Clinical Deterioration Risk' : 'Intermediate Risk'}).`;

  const background = `Observed clinical symptom complex: ${activeSymptoms.map(s => s.replace(/_/g, ' ')).join(', ') || 'Acute distress'}. Baseline vitals: SpO2 ${vitals.spO2}%, HR ${vitals.heartRate} bpm, SBP ${vitals.bloodPressureSys} mmHg, RR ${vitals.respiratoryRate}/min, Temp ${vitals.temperature}°F, Glucose ${vitals.bloodGlucose} mg/dL. Documented drug allergies: ${allergies.join(', ') || 'None recorded'}.`;

  const assessment = `Dynamic Bayesian Multi-Parameter Classifier identifies primary diagnostic probability of ${topDiagnosis ? `${topDiagnosis.name} (ICD-10: ${topDiagnosis.icd10}) at ${(topDiagnosis.posteriorProbability * 100).toFixed(0)}% probability` : 'Acute clinical deterioration'}. Underlying pathophysiological rationale: ${topDiagnosis?.rationale || 'Severe systemic compromise'}.`;

  const recommendation = `1. Immediate transfer via ALS Ambulance to Tertiary Medical Centre. 2. Maintain continuous pulse oximetry targeting SpO2 >= 92%. 3. Administer initial emergency protocol: ${topDiagnosis ? topDiagnosis.firstLineTherapy.slice(0, 2).join('; ') : 'Supplemental O2 and IV hydration'}. 4. Urgent lab workup upon arrival: ${topDiagnosis ? topDiagnosis.recommendedWorkup.slice(0, 3).join(', ') : 'ABG, CBC, Blood Cultures'}.`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Action Header */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Clinical Communication Protocol
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
            Standardized SBAR Tele-Referral Handoff
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Situation • Background • Assessment • Recommendation for hospital admission transfer
          </p>
        </div>

        <button
          onClick={handlePrint}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1.25rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 10px rgba(2, 132, 199, 0.2)' }}
        >
          <Printer size={16} /> Print / Export Official Transfer Sheet
        </button>
      </div>

      {isExported && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem 1rem', color: '#166534', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} /> SBAR Referral Record ready for tertiary hospital admission!
        </div>
      )}

      {/* Official Clean Document Layout */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '2rem', boxShadow: '0 4px 25px rgba(0,0,0,0.06)' }}>
        
        {/* Document Header */}
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              PRIMARY HEALTH CENTRE • TELE-TRIAGE REFERRAL RECORD
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              National Health Mission (NHM) Standard Telemedicine & Emergency Dispatch
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569' }}>
            <div><strong>Urgency:</strong> <span style={{ color: news2Score >= 7 ? '#dc2626' : '#0284c7', fontWeight: 700 }}>{transferUrgency.replace('_', ' ')}</span></div>
            <div><strong>Timestamp:</strong> {new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        {/* 4 Pillars of SBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b91c1c', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              S — Situation
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.6, margin: 0 }}>
              {situation}
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid #0284c7' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              B — Background
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.6, margin: 0 }}>
              {background}
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid #7c3aed' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6d28d9', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              A — Assessment
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.6, margin: 0 }}>
              {assessment}
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#047857', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              R — Recommendation
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.6, margin: 0 }}>
              {recommendation}
            </p>
          </div>

        </div>

        {/* Clinician Signature Line */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.2rem' }}>
              Attending Medical Officer:
            </label>
            <input
              type="text"
              value={physicianName}
              onChange={e => setPhysicianName(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '320px', color: '#0f172a', fontWeight: 600 }}
            />
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8' }}>
            Verified via CareSync AI Clinical Decision Support Engine
          </div>
        </div>

      </div>

    </div>
  );
};

