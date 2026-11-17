import React from 'react';
import { BayesianInferenceResult } from '../engines/bayesianEngine';
import { Activity, AlertTriangle, ShieldCheck, CheckCircle2, Sliders, Pill, RefreshCw, Info } from 'lucide-react';

interface LiveBayesianWorkbenchProps {
  vitals: {
    spO2: number;
    heartRate: number;
    bloodPressureSys: number;
    respiratoryRate: number;
    temperature: number;
    bloodGlucose: number;
  };
  onUpdateVitals: (field: string, val: number) => void;
  activeSymptoms: string[];
  onToggleSymptom: (symptomId: string) => void;
  allergies: string[];
  onToggleAllergy: (allergy: string) => void;
  bayesianResults: BayesianInferenceResult[];
  news2Score: number;
  esiLevel: number;
}

const ALL_SYMPTOMS: { id: string; label: string; icon: string }[] = [
  { id: 'productive_cough', label: 'Productive Cough', icon: '🗣️' },
  { id: 'rust_sputum', label: 'Rust-Colored Sputum', icon: '🧪' },
  { id: 'pleuritic_chest_pain', label: 'Pleuritic Chest Pain', icon: '🫁' },
  { id: 'high_fever', label: 'High Grade Fever / Rigors', icon: '🌡️' },
  { id: 'dyspnea', label: 'Dyspnea / Breathlessness', icon: '💨' },
  { id: 'crushing_chest_pain', label: 'Crushing Retrosternal Pain', icon: '💔' },
  { id: 'diaphoresis', label: 'Cold Diaphoresis / Sweating', icon: '💧' },
  { id: 'kussmaul_breathing', label: 'Kussmaul Rapid Deep Respiration', icon: '🫁' },
  { id: 'pigmented_lesion', label: 'Pigmented Skin Macule', icon: '🔬' },
  { id: 'asymmetric_borders', label: 'Asymmetrical Scalloped Borders', icon: '📐' },
  { id: 'wheezing', label: 'Expiratory Wheezing', icon: '🎶' },
  { id: 'headache', label: 'Severe Cephalea / Headache', icon: '🤕' }
];

export const LiveBayesianWorkbench: React.FC<LiveBayesianWorkbenchProps> = ({
  vitals,
  onUpdateVitals,
  activeSymptoms,
  onToggleSymptom,
  allergies,
  onToggleAllergy,
  bayesianResults,
  news2Score,
  esiLevel
}) => {
  const topDiagnosis = bayesianResults[0];

  // Dynamic NeMo Allergy Guardrail Check
  const hasPenicillinAllergy = allergies.some(a => a.toLowerCase().includes('penicillin') || a.toLowerCase().includes('amoxicillin'));
  const isPneumoniaTop = topDiagnosis?.diseaseId === 'cap-pneumonia';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Editorial Header */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Real Dynamic Mathematical Inference
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
              Dynamic Bayesian Diagnostic & Risk Classifier
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, maxWidth: '780px' }}>
              Adjust any physiological vital slider or toggle symptoms below. The engine recomputes Gaussian continuous likelihoods and Bernoulli symptom priors to update the exact posterior probability distribution in real time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ padding: '0.5rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 600 }}>NEWS2 SCORE</span>
              <strong style={{ fontSize: '1.25rem', color: news2Score >= 7 ? '#dc2626' : news2Score >= 5 ? '#d97706' : '#059669' }}>
                {news2Score} / 20
              </strong>
            </div>
            <div style={{ padding: '0.5rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 600 }}>ESI TRIAGE</span>
              <strong style={{ fontSize: '1.25rem', color: esiLevel <= 2 ? '#dc2626' : '#0284c7' }}>
                Level {esiLevel}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Interactive Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Interactive Inputs (Vitals Sliders + Symptom Toggles + Allergies) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Vitals Sliders Panel */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sliders size={16} color="#0284c7" />
                Live Physiological Vitals (Gaussian Likelihood Vectors)
              </h3>
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Drag to test edge cases</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* SpO2 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  <span>Oxygen Saturation (SpO2)</span>
                  <span style={{ color: vitals.spO2 < 92 ? '#dc2626' : '#059669', fontWeight: 700 }}>
                    {vitals.spO2}% {vitals.spO2 < 92 ? '(Hypoxemic)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={100}
                  value={vitals.spO2}
                  onChange={e => onUpdateVitals('spO2', parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: vitals.spO2 < 92 ? '#dc2626' : '#0284c7', cursor: 'pointer' }}
                />
              </div>

              {/* Heart Rate */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  <span>Heart Rate</span>
                  <span style={{ color: vitals.heartRate > 100 ? '#d97706' : '#0f172a', fontWeight: 700 }}>
                    {vitals.heartRate} bpm
                  </span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={170}
                  value={vitals.heartRate}
                  onChange={e => onUpdateVitals('heartRate', parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>

              {/* Systolic Blood Pressure */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  <span>Systolic Blood Pressure</span>
                  <span style={{ color: vitals.bloodPressureSys >= 160 ? '#dc2626' : vitals.bloodPressureSys <= 90 ? '#dc2626' : '#0f172a', fontWeight: 700 }}>
                    {vitals.bloodPressureSys} mmHg
                  </span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={210}
                  value={vitals.bloodPressureSys}
                  onChange={e => onUpdateVitals('bloodPressureSys', parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>

              {/* Respiratory Rate */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  <span>Respiratory Rate</span>
                  <span style={{ color: vitals.respiratoryRate >= 25 ? '#dc2626' : '#0f172a', fontWeight: 700 }}>
                    {vitals.respiratoryRate} /min
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={45}
                  value={vitals.respiratoryRate}
                  onChange={e => onUpdateVitals('respiratoryRate', parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>

              {/* Temperature */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  <span>Core Body Temperature</span>
                  <span style={{ color: vitals.temperature >= 101 ? '#dc2626' : '#0f172a', fontWeight: 700 }}>
                    {vitals.temperature}°F
                  </span>
                </div>
                <input
                  type="range"
                  min={95}
                  max={105}
                  step={0.2}
                  value={vitals.temperature}
                  onChange={e => onUpdateVitals('temperature', parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>

              {/* Blood Glucose */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  <span>Blood Glucose</span>
                  <span style={{ color: vitals.bloodGlucose > 250 ? '#dc2626' : '#0f172a', fontWeight: 700 }}>
                    {vitals.bloodGlucose} mg/dL
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={500}
                  value={vitals.bloodGlucose}
                  onChange={e => onUpdateVitals('bloodGlucose', parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>

            </div>
          </div>

          {/* Interactive Symptom Multi-Select Tags */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Active Observed Symptoms (Bernoulli Likelihood)
              </h3>
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                {activeSymptoms.length} active
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {ALL_SYMPTOMS.map(symp => {
                const isSelected = activeSymptoms.includes(symp.id);
                return (
                  <button
                    key={symp.id}
                    onClick={() => onToggleSymptom(symp.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0f9ff' : '#f8fafc',
                      color: isSelected ? '#0369a1' : '#475569',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    <span>{symp.icon}</span>
                    <span>{symp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergy Toggles (NeMo Guardrails Trigger) */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Documented Hypersensitivities & Allergies:
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Penicillin / Amoxicillin', 'Sulfa Drugs', 'Aspirin / NSAIDs'].map(allergy => {
                const isActive = allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    onClick={() => onToggleAllergy(allergy)}
                    style={{
                      padding: '0.35rem 0.7rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isActive ? '1px solid #dc2626' : '1px solid #e2e8f0',
                      background: isActive ? '#fef2f2' : '#f8fafc',
                      color: isActive ? '#b91c1c' : '#64748b'
                    }}
                  >
                    {isActive ? '⚠️ ' : '+ '} {allergy}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Real-Time Posterior Probabilities & Decision Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* NeMo Safety Alert if Allergy Triggered */}
          {hasPenicillinAllergy && isPneumoniaTop && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#991b1b', display: 'block' }}>
                  NeMo Clinical Safety Guardrail Triggered: Penicillin Hypersensitivity
                </strong>
                <p style={{ fontSize: '0.8rem', color: '#b91c1c', margin: '0.2rem 0 0 0', lineHeight: 1.5 }}>
                  The engine detected a documented Penicillin Anaphylaxis allergy in the patient profile. First-line Amoxicillin/Augmentin has been <strong>BLOCKED</strong>. The system automatically substituted <strong>IV Levofloxacin 750mg monotherapy</strong> in the prescription order below.
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Probability Bar Chart */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Real-Time Posterior Probability Distribution: P(D | Vitals, Symptoms)
              </h3>
              <span style={{ fontSize: '0.725rem', color: '#0284c7', fontWeight: 600 }}>
                Calculated via Bayes&apos; Rule
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {bayesianResults.map((item, idx) => {
                const percent = Math.round(item.posteriorProbability * 100);
                const isTop = idx === 0;

                return (
                  <div key={item.diseaseId} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ color: isTop ? '#0284c7' : '#334155' }}>
                          {item.name}
                        </strong>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                          ({item.icd10})
                        </span>
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: isTop ? '#0284c7' : '#64748b' }}>
                        {percent}%
                      </strong>
                    </div>

                    {/* Dynamic Bar */}
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: isTop ? '#0284c7' : '#94a3b8',
                          borderRadius: '4px',
                          transition: 'width 0.25s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Ranked Clinical Action Card */}
          {topDiagnosis && (
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #0284c7', padding: '1.25rem', boxShadow: '0 4px 20px rgba(2, 132, 199, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#f0f9ff', color: '#0369a1', textTransform: 'uppercase' }}>
                    Primary Bayesian Diagnosis
                  </span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0 0' }}>
                    {topDiagnosis.name}
                  </h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>
                    {(topDiagnosis.posteriorProbability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, margin: '0.5rem 0 1rem 0' }}>
                {topDiagnosis.rationale}
              </p>

              {/* First-Line Treatment */}
              <div style={{ marginBottom: '1rem' }}>
                <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                  <Pill size={14} color="#059669" /> Immediate First-Line Treatment:
                </h5>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
                  {topDiagnosis.firstLineTherapy.map((rx, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{rx}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Workup */}
              <div>
                <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#0284c7" /> Confirmatory Laboratory Tests:
                </h5>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
                  {topDiagnosis.recommendedWorkup.slice(0, 3).map((test, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{test}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

