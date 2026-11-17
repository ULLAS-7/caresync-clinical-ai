import React from 'react';
import { UserPlus, HeartPulse } from 'lucide-react';

interface HeaderNavProps {
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  onOpenCustomPatientModal: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  selectedPatientId,
  onSelectPatient,
  onOpenCustomPatientModal
}) => {
  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0.85rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Hospital Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <HeartPulse size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                CareSync <span style={{ color: '#0284c7', fontWeight: 700 }}>Clinical Decision Support</span>
              </span>
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#f1f5f9', color: '#475569', fontWeight: 600, border: '1px solid #e2e8f0' }}>
                Tele-Triage Platform
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0 0 0', lineHeight: 1.3 }}>
              Primary Health Centre Remote Triage & Biomarker Telemetry System
            </p>
          </div>
        </div>

        {/* Clinical Patient Selection Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <label htmlFor="patient-select" style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Case:
            </label>
            <select
              id="patient-select"
              value={selectedPatientId}
              onChange={e => onSelectPatient(e.target.value)}
              style={{ background: 'transparent', color: '#0f172a', border: 'none', fontSize: '0.8rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
            >
              <option value="pt-live">Live Subject Scan (Evaluating Presenter / Room Baseline)</option>
              <option value="pt-001">Case 1: Ramesh Gowda (Severe Pneumonia - Mandya PHC)</option>
              <option value="pt-002">Case 2: Lakshmi Devi (Acute STEMI - Kolar Sub-Divisional)</option>
              <option value="pt-004">Case 3: Sunita Bai (Septic Shock Crisis - Yadgir Taluk)</option>
              <option value="pt-003">Case 4: Anand Kumar (Melanoma Lesion - Chikkaballapur CHC)</option>
              <option value="custom">Custom Clinical Intake (Manual Case)</option>
            </select>
          </div>

          <button
            onClick={onOpenCustomPatientModal}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s ease' }}
          >
            <UserPlus size={14} />
            New Patient Intake
          </button>
        </div>

      </div>
    </header>
  );
};
