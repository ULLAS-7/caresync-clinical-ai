import React, { useState } from 'react';
import { PatientProfile, TriageScore } from '../types/clinical';
import { Activity, AlertTriangle, Mic, Volume2, ShieldAlert, CheckCircle2, Heart, Wind, Thermometer, Droplet } from 'lucide-react';

interface PatientTriageViewProps {
  patient: PatientProfile;
  triage: TriageScore;
  onUpdateVitals: (newVitals: Partial<PatientProfile['vitals']>) => void;
}

export const PatientTriageView: React.FC<PatientTriageViewProps> = ({
  patient,
  triage,
  onUpdateVitals
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranslated, setVoiceTranslated] = useState<string | null>(null);

  const simulateVoiceIntake = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setVoiceTranslated(`[Whisper ASR translated from ${patient.language}]: "Doctor, I have severe shortness of breath since 4 days. Shivering with high fever and coughing up brownish thick phlegm. Cannot walk without gasping."`);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner: Emergency Severity & NEWS2 Score Overview */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        
        {/* Patient Profile Card */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ background: '#0369a1', color: '#e0f2fe', padding: '0.2rem 0.5rem', borderRadius: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}>
              ID: {patient.id}
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              {patient.name}
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>
            {patient.age} yrs • {patient.gender} • {patient.location}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ padding: '0.2rem 0.5rem', background: '#1e293b', borderRadius: '0.3rem', color: '#cbd5e1' }}>
              🗣️ Language: {patient.language}
            </span>
            {patient.allergies.map((a, i) => (
              <span key={i} style={{ padding: '0.2rem 0.5rem', background: '#7f1d1d', borderRadius: '0.3rem', color: '#fca5a5', fontWeight: 600 }}>
                ⚠️ Allergy: {a}
              </span>
            ))}
          </div>
        </div>

        {/* NEWS2 Score Card */}
        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '0.75rem', border: `2px solid ${triage.colorCode}`, textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            National Early Warning Score (NEWS2)
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '0.4rem', margin: '0.3rem 0' }}>
            <strong style={{ fontSize: '2.5rem', color: triage.colorCode, fontWeight: 800, lineHeight: 1 }}>
              {triage.news2Score}
            </strong>
            <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 20</span>
          </div>
          <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: triage.colorCode + '25', color: triage.colorCode }}>
            {triage.news2Risk.toUpperCase()} CLINICAL RISK
          </span>
        </div>

        {/* ESI Triage Urgency Level */}
        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #334155', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            Emergency Severity Index (ESI)
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: triage.colorCode, margin: '0.3rem 0', lineHeight: 1 }}>
            Level {triage.esiLevel}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600 }}>
            {triage.esiLevel === 1 ? 'Immediate Resuscitation' : triage.esiLevel === 2 ? 'Emergent (<15 min)' : 'Urgent Assessment'}
          </span>
        </div>
      </div>

      {/* Urgent Warning Flags if present */}
      {triage.urgentFlags.length > 0 && (
        <div style={{ background: '#450a0a', border: '1px solid #991b1b', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
            <AlertTriangle size={18} /> Critical Physiological Warning Flags:
          </div>
          <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', color: '#fca5a5', lineHeight: 1.6 }}>
            {triage.urgentFlags.map((flag, idx) => (
              <li key={idx}><strong>{flag}</strong></li>
            ))}
          </ul>
        </div>
      )}

      {/* Live Vitals Telemetry Grid */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="#38bdf8" />
          Primary Physiological Vitals (Editable for Real-Time Recalculation)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          {/* SpO2 */}
          <div style={{ background: '#0f172a', border: patient.vitals.spO2 < 92 ? '2px solid #ef4444' : '1px solid #1e293b', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Oxygen Saturation</span>
              <Wind size={16} color={patient.vitals.spO2 < 92 ? '#ef4444' : '#38bdf8'} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <input
                type="number"
                value={patient.vitals.spO2}
                onChange={e => onUpdateVitals({ spO2: parseInt(e.target.value, 10) || 0 })}
                style={{ width: '80px', fontSize: '1.8rem', fontWeight: 800, background: '#1e293b', color: patient.vitals.spO2 < 92 ? '#f87171' : '#38bdf8', border: '1px solid #334155', borderRadius: '0.4rem', padding: '0.1rem 0.4rem' }}
              />
              <span style={{ fontSize: '1rem', color: '#94a3b8' }}>%</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: patient.vitals.spO2 < 92 ? '#f87171' : '#22c55e', marginTop: '0.3rem', display: 'block' }}>
              {patient.vitals.spO2 < 92 ? '⚠️ Hypoxemia Warning' : 'Normal Range (95-100%)'}
            </span>
          </div>

          {/* Heart Rate */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Heart Rate</span>
              <Heart size={16} color="#ec4899" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <input
                type="number"
                value={patient.vitals.heartRate}
                onChange={e => onUpdateVitals({ heartRate: parseInt(e.target.value, 10) || 0 })}
                style={{ width: '80px', fontSize: '1.8rem', fontWeight: 800, background: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '0.4rem', padding: '0.1rem 0.4rem' }}
              />
              <span style={{ fontSize: '1rem', color: '#94a3b8' }}>bpm</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: patient.vitals.heartRate > 100 ? '#f59e0b' : '#22c55e', marginTop: '0.3rem', display: 'block' }}>
              {patient.vitals.heartRate > 100 ? 'Tachycardia (Elevated)' : 'Normal (60-100)'}
            </span>
          </div>

          {/* Blood Pressure */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Blood Pressure (Sys/Dia)</span>
              <Activity size={16} color="#a855f7" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <input
                type="number"
                value={patient.vitals.bloodPressureSys}
                onChange={e => onUpdateVitals({ bloodPressureSys: parseInt(e.target.value, 10) || 0 })}
                style={{ width: '65px', fontSize: '1.5rem', fontWeight: 800, background: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '0.4rem', padding: '0.1rem 0.4rem' }}
              />
              <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>/</span>
              <input
                type="number"
                value={patient.vitals.bloodPressureDia}
                onChange={e => onUpdateVitals({ bloodPressureDia: parseInt(e.target.value, 10) || 0 })}
                style={{ width: '65px', fontSize: '1.5rem', fontWeight: 800, background: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '0.4rem', padding: '0.1rem 0.4rem' }}
              />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem', display: 'block' }}>
              mmHg
            </span>
          </div>

          {/* Respiratory Rate */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Respiratory Rate</span>
              <Wind size={16} color="#06b6d4" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <input
                type="number"
                value={patient.vitals.respiratoryRate}
                onChange={e => onUpdateVitals({ respiratoryRate: parseInt(e.target.value, 10) || 0 })}
                style={{ width: '80px', fontSize: '1.8rem', fontWeight: 800, background: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '0.4rem', padding: '0.1rem 0.4rem' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/min</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: patient.vitals.respiratoryRate >= 25 ? '#ef4444' : '#22c55e', marginTop: '0.3rem', display: 'block' }}>
              {patient.vitals.respiratoryRate >= 25 ? '⚠️ Severe Tachypnea' : 'Normal (12-20)'}
            </span>
          </div>

          {/* Temperature */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Body Temperature</span>
              <Thermometer size={16} color="#f97316" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <input
                type="number"
                step="0.1"
                value={patient.vitals.temperature}
                onChange={e => onUpdateVitals({ temperature: parseFloat(e.target.value) || 0 })}
                style={{ width: '85px', fontSize: '1.8rem', fontWeight: 800, background: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '0.4rem', padding: '0.1rem 0.4rem' }}
              />
              <span style={{ fontSize: '1rem', color: '#94a3b8' }}>°F</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: patient.vitals.temperature >= 101 ? '#ef4444' : '#22c55e', marginTop: '0.3rem', display: 'block' }}>
              {patient.vitals.temperature >= 101 ? 'Pyrexia (High Fever)' : 'Normothermic'}
            </span>
          </div>

        </div>
      </div>

      {/* Multilingual Voice Triage Assistant */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mic size={18} color="#38bdf8" />
              Multilingual Voice Symptom Tele-Intake (OpenAI Whisper Edge Engine)
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Patients speak in regional language ({patient.language}). Audio is translated and transcribed on-device into English clinical terms.
            </p>
          </div>

          <button
            onClick={simulateVoiceIntake}
            disabled={isRecording}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: isRecording ? '#dc2626' : '#0284c7', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: isRecording ? 'not-allowed' : 'pointer' }}
          >
            <Mic size={16} />
            {isRecording ? 'Listening & Transcribing...' : `Simulate Voice Intake (${patient.language})`}
          </button>
        </div>

        {voiceTranslated ? (
          <div style={{ padding: '0.85rem 1rem', background: '#1e293b', borderRadius: '0.5rem', borderLeft: '4px solid #06b6d4', fontSize: '0.85rem', color: '#e0f2fe', lineHeight: 1.5 }}>
            {voiceTranslated}
          </div>
        ) : (
          <div style={{ padding: '0.85rem 1rem', background: '#1e293b', borderRadius: '0.5rem', border: '1px dashed #334155', fontSize: '0.825rem', color: '#94a3b8' }}>
            Current Recorded Chief Complaint: &ldquo;{patient.chiefComplaint}&rdquo;
          </div>
        )}
      </div>

    </div>
  );
};

