import React, { useState, useMemo } from 'react';
import { computeDynamicBayesianDiagnosis } from './engines/bayesianEngine';
import { calculateNEWS2AndESI } from './engines/triageEngine';
import { HeaderNav } from './components/HeaderNav';
import { UnifiedClinicalConsole } from './components/UnifiedClinicalConsole';
import { CustomPatientModal } from './components/CustomPatientModal';

export const App: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pt-001');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Active Patient Demographics
  const [patientName, setPatientName] = useState<string>('Ramesh Gowda');
  const [patientAge, setPatientAge] = useState<number>(62);
  const [patientLocation, setPatientLocation] = useState<string>('Mandya Rural PHC (Karnataka)');

  // Live Reactive Vitals
  const [vitals, setVitals] = useState({
    spO2: 88,
    heartRate: 112,
    bloodPressureSys: 98,
    bloodPressureDia: 62,
    respiratoryRate: 28,
    temperature: 102.4,
    bloodGlucose: 145
  });

  // Active Observed Symptoms
  const [activeSymptoms, setActiveSymptoms] = useState<string[]>([
    'productive_cough',
    'rust_sputum',
    'pleuritic_chest_pain',
    'high_fever',
    'dyspnea'
  ]);

  // Documented Allergies
  const [allergies, setAllergies] = useState<string[]>([
    'Penicillin / Amoxicillin (Severe Anaphylaxis)'
  ]);

  // Handle Preset Patient Selection
  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    if (id === 'pt-live') {
      setPatientName('Live Subject (Judge / Presenter)');
      setPatientAge(32);
      setPatientLocation('Live Demonstration Hall');
      setVitals({
        spO2: 98,
        heartRate: 72,
        bloodPressureSys: 120,
        bloodPressureDia: 78,
        respiratoryRate: 16,
        temperature: 98.6,
        bloodGlucose: 96
      });
      setActiveSymptoms([]);
      setAllergies([]);
    } else if (id === 'pt-001') {
      setPatientName('Ramesh Gowda');
      setPatientAge(62);
      setPatientLocation('Mandya Rural PHC (Karnataka)');
      setVitals({
        spO2: 88,
        heartRate: 112,
        bloodPressureSys: 98,
        bloodPressureDia: 62,
        respiratoryRate: 28,
        temperature: 102.4,
        bloodGlucose: 145
      });
      setActiveSymptoms(['productive_cough', 'rust_sputum', 'pleuritic_chest_pain', 'high_fever', 'dyspnea']);
      setAllergies(['Penicillin / Amoxicillin (Severe Anaphylaxis)']);
    } else if (id === 'pt-002') {
      setPatientName('Lakshmi Devi');
      setPatientAge(58);
      setPatientLocation('Kolar Sub-Divisional Hospital');
      setVitals({
        spO2: 95,
        heartRate: 106,
        bloodPressureSys: 172,
        bloodPressureDia: 102,
        respiratoryRate: 22,
        temperature: 98.6,
        bloodGlucose: 218
      });
      setActiveSymptoms(['crushing_chest_pain', 'diaphoresis', 'dyspnea']);
      setAllergies([]);
    } else if (id === 'pt-003') {
      setPatientName('Anand Kumar');
      setPatientAge(44);
      setPatientLocation('Chikkaballapur Community Health Centre');
      setVitals({
        spO2: 99,
        heartRate: 74,
        bloodPressureSys: 124,
        bloodPressureDia: 78,
        respiratoryRate: 16,
        temperature: 98.4,
        bloodGlucose: 108
      });
      setActiveSymptoms(['pigmented_lesion']);
      setAllergies(['Sulfa Drugs']);
    } else if (id === 'pt-004') {
      setPatientName('Sunita Bai (Septic Crisis)');
      setPatientAge(51);
      setPatientLocation('Yadgir Taluk Hospital (Karnataka)');
      setVitals({
        spO2: 85,
        heartRate: 134,
        bloodPressureSys: 78,
        bloodPressureDia: 46,
        respiratoryRate: 34,
        temperature: 103.8,
        bloodGlucose: 195
      });
      setActiveSymptoms(['high_fever', 'dyspnea', 'diaphoresis']);
      setAllergies(['Penicillin / Amoxicillin (Severe Anaphylaxis)']);
    }
  };

  const handleUpdateVitalField = (field: string, val: number) => {
    setVitals(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleToggleSymptom = (sympId: string) => {
    setActiveSymptoms(prev =>
      prev.includes(sympId) ? prev.filter(s => s !== sympId) : [...prev, sympId]
    );
  };

  const handleToggleAllergy = (allergy: string) => {
    setAllergies(prev =>
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const handleBatchUpdateCase = (
    newVitals: Partial<typeof vitals>,
    newSymptoms: string[],
    newCaseName?: string,
    newLocation?: string
  ) => {
    setVitals(prev => ({
      ...prev,
      ...newVitals
    }));
    setActiveSymptoms(newSymptoms);
    if (newCaseName) setPatientName(newCaseName);
    if (newLocation) setPatientLocation(newLocation);
  };

  const handleCreateCustomPatient = (newP: any) => {
    setSelectedPatientId('custom');
    setPatientName(newP.name);
    setPatientAge(newP.age);
    setPatientLocation(newP.location);
    setVitals({
      ...newP.vitals,
      bloodPressureDia: 75
    });
    setActiveSymptoms(newP.symptoms);
    setAllergies(newP.allergies);
  };

  // REAL-TIME MATHEMATICAL BAYESIAN COMPUTATIONS (<12ms execution in-browser)
  const bayesianResults = useMemo(() => {
    return computeDynamicBayesianDiagnosis(vitals, activeSymptoms);
  }, [vitals, activeSymptoms]);

  const triageData = useMemo(() => {
    return calculateNEWS2AndESI({
      id: selectedPatientId,
      name: patientName,
      age: patientAge,
      gender: 'Male',
      location: patientLocation,
      language: 'English',
      vitals: vitals as any,
      consciousness: 'Alert',
      chiefComplaint: '',
      symptoms: activeSymptoms,
      durationDays: 3,
      allergies,
      comorbidities: []
    });
  }, [selectedPatientId, patientName, patientAge, patientLocation, vitals, activeSymptoms, allergies]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#0f172a' }}>
      
      {/* Enterprise Editorial Header */}
      <HeaderNav
        selectedPatientId={selectedPatientId}
        onSelectPatient={handleSelectPatient}
        onOpenCustomPatientModal={() => setIsModalOpen(true)}
      />

      {/* Main Clinical Console */}
      <main style={{ flex: 1, padding: '1.5rem 1.75rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        <UnifiedClinicalConsole
          patientName={patientName}
          patientAge={patientAge}
          patientLocation={patientLocation}
          vitals={vitals}
          onUpdateVital={handleUpdateVitalField}
          onBatchUpdateCase={handleBatchUpdateCase}
          activeSymptoms={activeSymptoms}
          onToggleSymptom={handleToggleSymptom}
          allergies={allergies}
          onToggleAllergy={handleToggleAllergy}
          bayesianResults={bayesianResults}
          news2Score={triageData.news2Score}
          esiLevel={triageData.esiLevel}
        />
      </main>

      {/* Custom Patient Modal */}
      <CustomPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePatient={handleCreateCustomPatient}
      />

      {/* Editorial Clinical Footer */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '1rem 1.75rem', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
        <p style={{ margin: 0 }}>
          <strong>CareSync Clinical AI</strong> • Multimodal Clinical Decision Support & Tele-Triage Platform
        </p>
        <p style={{ margin: '0.2rem 0 0 0', opacity: 0.85 }}>
          Engineered for rural primary healthcare with in-browser Bayesian inference (&lt;12ms latency), rPPG non-contact optical vital telemetry, and hard contraindication safety guardrails.
        </p>
      </footer>

    </div>
  );
};
