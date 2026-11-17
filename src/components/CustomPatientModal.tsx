import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';

interface CustomPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePatient: (newPatient: {
    name: string;
    age: number;
    location: string;
    vitals: {
      spO2: number;
      heartRate: number;
      bloodPressureSys: number;
      respiratoryRate: number;
      temperature: number;
      bloodGlucose: number;
    };
    symptoms: string[];
    allergies: string[];
  }) => void;
}

export const CustomPatientModal: React.FC<CustomPatientModalProps> = ({
  isOpen,
  onClose,
  onCreatePatient
}) => {
  const [name, setName] = useState('Ananya Sharma');
  const [age, setAge] = useState(34);
  const [location, setLocation] = useState('Hassan Taluk Hospital');
  const [spO2, setSpO2] = useState(91);
  const [heartRate, setHeartRate] = useState(115);
  const [bloodPressureSys, setBloodPressureSys] = useState(105);
  const [respiratoryRate, setRespiratoryRate] = useState(26);
  const [temperature, setTemperature] = useState(101.8);
  const [bloodGlucose, setBloodGlucose] = useState(135);
  const [symptoms, setSymptoms] = useState<string[]>(['productive_cough', 'high_fever', 'dyspnea']);
  const [allergies, setAllergies] = useState<string[]>(['Penicillin / Amoxicillin']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePatient({
      name,
      age,
      location,
      vitals: {
        spO2,
        heartRate,
        bloodPressureSys,
        respiratoryRate,
        temperature,
        bloodGlucose
      },
      symptoms,
      allergies
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #cbd5e1', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Create Custom Clinical Patient
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Define custom vitals and symptoms to test the dynamic Bayesian inference engine.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Patient Name:</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Age:</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(parseInt(e.target.value, 10))}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Clinical Location / PHC:</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              required
            />
          </div>

          {/* Vitals Grid */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
              Initial Physiological Vitals:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>SpO2 (%)</span>
                <input
                  type="number"
                  value={spO2}
                  onChange={e => setSpO2(parseInt(e.target.value, 10))}
                  style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Heart Rate (bpm)</span>
                <input
                  type="number"
                  value={heartRate}
                  onChange={e => setHeartRate(parseInt(e.target.value, 10))}
                  style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Systolic BP</span>
                <input
                  type="number"
                  value={bloodPressureSys}
                  onChange={e => setBloodPressureSys(parseInt(e.target.value, 10))}
                  style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Resp Rate (/min)</span>
                <input
                  type="number"
                  value={respiratoryRate}
                  onChange={e => setRespiratoryRate(parseInt(e.target.value, 10))}
                  style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Temp (°F)</span>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Glucose (mg/dL)</span>
                <input
                  type="number"
                  value={bloodGlucose}
                  onChange={e => setBloodGlucose(parseInt(e.target.value, 10))}
                  style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <Check size={16} /> Save & Compute Diagnosis
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

