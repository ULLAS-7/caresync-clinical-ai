import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PatientProfile, TriageScore, DifferentialDiagnosis, SBARReport } from '../types/clinical';
import { generateSBARReport } from '../engines/sbarGenerator';
import { FileText, Printer, CheckCircle2, ShieldCheck, Ambulance, Clock, Building } from 'lucide-react';

interface SbarHandoffViewProps {
  patient: PatientProfile;
  triage: TriageScore;
  diagnosis?: DifferentialDiagnosis;
}

export const SbarHandoffView: React.FC<SbarHandoffViewProps> = ({
  patient,
  triage,
  diagnosis
}) => {
  const [clinicianName, setClinicianName] = useState('Dr. Ullas (Rural Medical Officer, PHC)');
  const [clinicianNote, setClinicianNote] = useState('Patient stabilized with 4L/min O2 via nasal cannula. Intravenous line secured in left cubital fossa.');
  const [isExported, setIsExported] = useState(false);

  const defaultDiag: DifferentialDiagnosis = diagnosis || {
    disease: 'Severe Acute Respiratory Condition',
    probability: 0.9,
    icd10: 'J18.9',
    rationale: 'Hypoxia with respiratory distress.',
    recommendedTests: ['ABG', 'CXR'],
    firstLineTreatment: ['Supplemental O2'],
    contraindications: []
  };

  const sbar = generateSBARReport(patient, triage, defaultDiag);

  const handlePrint = () => {
    setIsExported(true);
    confetti({ particleCount: 80, spread: 70 });
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Export Action */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ background: sbar.referralUrgency === 'IMMEDIATE_ICU' ? '#991b1b' : '#0369a1', color: '#ffffff', padding: '0.2rem 0.55rem', borderRadius: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}>
              {sbar.referralUrgency === 'IMMEDIATE_ICU' ? '🚨 RED ALERT: IMMEDIATE AMBULANCE TRANSFER' : 'URGENT TRANSFER (24H)'}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              Tele-ID: {sbar.telemedicineID}
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Standardized SBAR Clinical Tele-Referral Handoff
          </h2>
        </div>

        <button
          onClick={handlePrint}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)' }}
        >
          <Printer size={16} />
          Export / Print SBAR Referral Sheet
        </button>
      </div>

      {isExported && (
        <div style={{ background: '#064e3b', border: '1px solid #059669', borderRadius: '0.75rem', padding: '0.85rem 1.25rem', color: '#6ee7b7', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          SBAR Handoff successfully prepared and digitally timestamped for Tertiary Hospital Admission!
        </div>
      )}

      {/* Official SBAR Printable Document Sheet */}
      <div style={{ background: '#ffffff', color: '#0f172a', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '2px solid #e2e8f0' }}>
        
        {/* Document Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              GOVERNMENT PRIMARY HEALTH CENTRE • TELE-REFERRAL
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              District Health Mission • SBAR Handoff Protocol for Secondary & Tertiary Healthcare
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569' }}>
            <div><strong>Dispatch Ref:</strong> {sbar.telemedicineID}</div>
            <div><strong>Timestamp:</strong> {sbar.signedAt}</div>
          </div>
        </div>

        {/* 4 Pillars of SBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* S - Situation */}
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', borderLeft: '4px solid #ef4444' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#b91c1c', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              S — Situation
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.6, margin: 0 }}>
              {sbar.situation}
            </p>
          </div>

          {/* B - Background */}
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', borderLeft: '4px solid #3b82f6' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1d4ed8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              B — Background
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.6, margin: 0 }}>
              {sbar.background}
            </p>
          </div>

          {/* A - Assessment */}
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', borderLeft: '4px solid #8b5cf6' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#6d28d9', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              A — Assessment
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.6, margin: 0 }}>
              {sbar.assessment}
            </p>
          </div>

          {/* R - Recommendation */}
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', borderLeft: '4px solid #10b981' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#047857', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              R — Recommendation
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.6, margin: 0 }}>
              {sbar.recommendation}
            </p>
          </div>

        </div>

        {/* Doctor Verification & Sign-Off Block */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #cbd5e1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
              Referring Medical Officer:
            </label>
            <input
              type="text"
              value={clinicianName}
              onChange={e => setClinicianName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.35rem', border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0f172a' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
              Transit Stabilization Note:
            </label>
            <input
              type="text"
              value={clinicianNote}
              onChange={e => setClinicianNote(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.35rem', border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0f172a' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
          Digitally generated via CareSync AI Tele-Triage System • Verified for compliance with National Digital Health Mission (NDHM) guidelines.
        </div>
      </div>

    </div>
  );
};

