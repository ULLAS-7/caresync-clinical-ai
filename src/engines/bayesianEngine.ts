// CareSync AI - Real Dynamic Bayesian Medical Diagnostic Classifier
// Computes exact posterior probability distribution P(Disease | Vitals, Symptoms)
// using Gaussian continuous likelihood for vitals and Bernoulli likelihood for symptoms.

export interface DiseaseProfile {
  id: string;
  name: string;
  icd10: string;
  category: 'Respiratory' | 'Cardiovascular' | 'Dermatological' | 'Endocrine' | 'Infectious';
  priorProbability: number;
  vitalDistributions: {
    spO2: { mean: number; std: number };
    heartRate: { mean: number; std: number };
    bloodPressureSys: { mean: number; std: number };
    respiratoryRate: { mean: number; std: number };
    temperature: { mean: number; std: number };
    bloodGlucose: { mean: number; std: number };
  };
  symptomLikelihoods: Record<string, number>; // P(Symptom | Disease)
  recommendedWorkup: string[];
  firstLineTherapy: string[];
  contraindications: string[];
  rationaleTemplate: string;
}

export const CLINICAL_DISEASE_KB: DiseaseProfile[] = [
  {
    id: 'cap-pneumonia',
    name: 'Community-Acquired Lobar Pneumonia',
    icd10: 'J18.9',
    category: 'Respiratory',
    priorProbability: 0.22,
    vitalDistributions: {
      spO2: { mean: 89, std: 4 },
      heartRate: { mean: 110, std: 12 },
      bloodPressureSys: { mean: 105, std: 15 },
      respiratoryRate: { mean: 27, std: 4 },
      temperature: { mean: 102.2, std: 1.2 },
      bloodGlucose: { mean: 130, std: 25 }
    },
    symptomLikelihoods: {
      'productive_cough': 0.92,
      'rust_sputum': 0.84,
      'pleuritic_chest_pain': 0.78,
      'high_fever': 0.88,
      'dyspnea': 0.85,
      'tachycardia': 0.82,
      'crushing_chest_pain': 0.05,
      'diaphoresis': 0.35,
      'kussmaul_breathing': 0.05,
      'pigmented_lesion': 0.01,
      'asymmetric_borders': 0.01,
      'wheezing': 0.25,
      'headache': 0.40
    },
    recommendedWorkup: [
      'Arterial Blood Gas (ABG) for PaO2/FiO2 ratio',
      'PA & Lateral Chest Radiograph (CXR)',
      'Blood Cultures x 2 sets prior to antimicrobial administration',
      'Sputum Gram Stain & Culture with antimicrobial susceptibility',
      'Serum Creatinine & Blood Urea Nitrogen (BUN) for CURB-65 calculation'
    ],
    firstLineTherapy: [
      'High-Flow Supplemental Oxygen via Venturi Mask titrated to target SpO2 >= 92%',
      'IV Levofloxacin 750mg q24h (PENICILLIN-ALLERGY SAFE MONOTHERAPY)',
      'IV Balanced Crystalloid Resuscitation (500mL bolus)',
      'Antipyresis: Paracetamol 1g IV for core temperature > 101°F'
    ],
    contraindications: [
      'CONTRAINDICATION: Beta-lactams / Amoxicillin if patient has documented Penicillin anaphylaxis',
      'Avoid unmonitored non-selective beta-blockers'
    ],
    rationaleTemplate: 'High posterior likelihood driven by profound hypoxemia, tachypnea, high-grade pyrexia, and characteristic alveolar consolidation markers.'
  },
  {
    id: 'stemi-acs',
    name: 'Acute ST-Elevation Myocardial Infarction (STEMI)',
    icd10: 'I21.9',
    category: 'Cardiovascular',
    priorProbability: 0.18,
    vitalDistributions: {
      spO2: { mean: 95, std: 3 },
      heartRate: { mean: 104, std: 14 },
      bloodPressureSys: { mean: 165, std: 22 },
      respiratoryRate: { mean: 22, std: 3 },
      temperature: { mean: 98.6, std: 0.6 },
      bloodGlucose: { mean: 195, std: 45 }
    },
    symptomLikelihoods: {
      'productive_cough': 0.05,
      'rust_sputum': 0.02,
      'pleuritic_chest_pain': 0.20,
      'high_fever': 0.08,
      'dyspnea': 0.72,
      'tachycardia': 0.78,
      'crushing_chest_pain': 0.94,
      'diaphoresis': 0.89,
      'kussmaul_breathing': 0.05,
      'pigmented_lesion': 0.01,
      'asymmetric_borders': 0.01,
      'wheezing': 0.15,
      'headache': 0.20
    },
    recommendedWorkup: [
      'Immediate 12-Lead ECG within 10 minutes of clinical contact',
      'High-Sensitivity Cardiac Troponin I/T (hs-cTn) at 0h and 1h',
      'Bedside Echocardiography for regional wall motion abnormality (RWMA)',
      'Continuous cardiac rhythm telemetry for lethal ventricular dysrhythmias'
    ],
    firstLineTherapy: [
      'Dispersible Aspirin 300mg chewed immediately',
      'Loading dose Ticagrelor 180mg PO or Clopidogrel 300mg PO',
      'Sublingual Nitroglycerin 0.4mg (hold if SBP < 90 mmHg or right ventricular MI)',
      'Immediate ALS ambulance dispatch to primary PCI facility (Target Door-to-Balloon < 90 min)'
    ],
    contraindications: [
      'STRICT CONTRAINDICATION: Nitrates if patient has used phosphodiesterase-5 inhibitors within 24-48h',
      'Avoid NSAIDs (other than Aspirin) due to increased myocardial rupture risk'
    ],
    rationaleTemplate: 'Overwhelming cardiovascular risk pattern: severe crushing retrosternal pain, autonomic diaphoresis, hypertension, and tachycardia.'
  },
  {
    id: 'dermatological-melanoma',
    name: 'Cutaneous Malignant Melanoma (Superficial Spreading)',
    icd10: 'C43.9',
    category: 'Dermatological',
    priorProbability: 0.12,
    vitalDistributions: {
      spO2: { mean: 99, std: 1 },
      heartRate: { mean: 72, std: 8 },
      bloodPressureSys: { mean: 122, std: 10 },
      respiratoryRate: { mean: 16, std: 2 },
      temperature: { mean: 98.4, std: 0.4 },
      bloodGlucose: { mean: 105, std: 15 }
    },
    symptomLikelihoods: {
      'productive_cough': 0.01,
      'rust_sputum': 0.01,
      'pleuritic_chest_pain': 0.01,
      'high_fever': 0.02,
      'dyspnea': 0.01,
      'tachycardia': 0.05,
      'crushing_chest_pain': 0.01,
      'diaphoresis': 0.02,
      'kussmaul_breathing': 0.01,
      'pigmented_lesion': 0.98,
      'asymmetric_borders': 0.95,
      'wheezing': 0.01,
      'headache': 0.05
    },
    recommendedWorkup: [
      'Epiluminescence Dermoscopy with 10x polarized optical magnification',
      'Full-thickness complete excisional biopsy with 1-2mm clinical margins',
      'Histopathologic measurement of Breslow thickness and Clark level of invasion',
      'Sentinel lymph node biopsy (SLNB) if Breslow depth > 0.8mm'
    ],
    firstLineTherapy: [
      'Urgent surgical referral to Surgical Oncology within 7 calendar days',
      'Wide local excision following histopathological confirmation',
      'Patient counseling on photoprotection and avoidance of topical chemical cautery'
    ],
    contraindications: [
      'ABSOLUTE CONTRAINDICATION: Partial shave or punch biopsy through center of lesion (destroys staging depth)',
      'Do not apply topical corticosteroids or cryotherapy'
    ],
    rationaleTemplate: 'Dermatological profile: Asymmetry, irregular scalloped perimeter, focal pigmentation heterogeneity, and absence of systemic distress.'
  },
  {
    id: 'diabetic-ketoacidosis',
    name: 'Diabetic Ketoacidosis (DKA) with Metabolic Acidosis',
    icd10: 'E10.1',
    category: 'Endocrine',
    priorProbability: 0.14,
    vitalDistributions: {
      spO2: { mean: 98, std: 2 },
      heartRate: { mean: 124, std: 15 },
      bloodPressureSys: { mean: 92, std: 12 },
      respiratoryRate: { mean: 31, std: 4 },
      temperature: { mean: 99.2, std: 1.0 },
      bloodGlucose: { mean: 410, std: 70 }
    },
    symptomLikelihoods: {
      'productive_cough': 0.05,
      'rust_sputum': 0.02,
      'pleuritic_chest_pain': 0.10,
      'high_fever': 0.25,
      'dyspnea': 0.65,
      'tachycardia': 0.90,
      'crushing_chest_pain': 0.08,
      'diaphoresis': 0.45,
      'kussmaul_breathing': 0.94,
      'pigmented_lesion': 0.01,
      'asymmetric_borders': 0.01,
      'wheezing': 0.05,
      'headache': 0.60
    },
    recommendedWorkup: [
      'Immediate Point-of-Care Capillary Blood Glucose and Blood Ketones (Beta-hydroxybutyrate)',
      'Serum Electrolytes (Sodium, Potassium, Chloride, Bicarbonate) for Anion Gap calculation',
      'Arterial or Venous Blood Gas for pH and Base Deficit',
      'Urinalysis for glucosuria and ketonuria'
    ],
    firstLineTherapy: [
      'Aggressive IV Fluid Resuscitation: 0.9% Normal Saline 1000 mL in first hour',
      'IV Regular Insulin Infusion: 0.1 units/kg/hour (only after verifying K+ > 3.3 mEq/L)',
      'Potassium chloride supplementation (20-30 mEq per liter of IV fluid) once urine output established',
      'Continuous hemodynamic and electrolyte monitoring every 2 hours'
    ],
    contraindications: [
      'CONTRAINDICATION: Do NOT initiate Insulin bolus if Serum Potassium < 3.3 mEq/L (fatal arrhythmia risk)',
      'Avoid bicarbonate infusion unless arterial pH < 6.9'
    ],
    rationaleTemplate: 'Endocrine emergency: Kussmaul compensatory hyperventilation, hyperglycemia > 300 mg/dL, severe dehydration, and tachycardia.'
  },
  {
    id: 'acute-pulmonary-embolism',
    name: 'Acute Massive Pulmonary Embolism',
    icd10: 'I26.9',
    category: 'Respiratory',
    priorProbability: 0.10,
    vitalDistributions: {
      spO2: { mean: 86, std: 5 },
      heartRate: { mean: 128, std: 14 },
      bloodPressureSys: { mean: 88, std: 14 },
      respiratoryRate: { mean: 30, std: 5 },
      temperature: { mean: 98.8, std: 0.8 },
      bloodGlucose: { mean: 125, std: 20 }
    },
    symptomLikelihoods: {
      'productive_cough': 0.15,
      'rust_sputum': 0.30,
      'pleuritic_chest_pain': 0.82,
      'high_fever': 0.15,
      'dyspnea': 0.96,
      'tachycardia': 0.92,
      'crushing_chest_pain': 0.40,
      'diaphoresis': 0.60,
      'kussmaul_breathing': 0.10,
      'pigmented_lesion': 0.01,
      'asymmetric_borders': 0.01,
      'wheezing': 0.20,
      'headache': 0.10
    },
    recommendedWorkup: [
      'CT Pulmonary Angiography (CTPA) - Gold Standard',
      'Serum D-Dimer Quantitative Assay',
      '12-Lead ECG (look for S1Q3T3 pattern, right bundle branch block)',
      'Bedside Transthoracic Echo for McConnell sign (RV strain)'
    ],
    firstLineTherapy: [
      'Immediate therapeutic anticoagulation with Low Molecular Weight Heparin or Unfractionated Heparin',
      'High-Flow Oxygen & mechanical ventilatory support if refractory hypoxemia',
      'Systemic Thrombolysis (Alteplase 100mg IV) if hemodynamically unstable with shock'
    ],
    contraindications: [
      'STRICT CONTRAINDICATION: Thrombolysis if active internal bleeding or recent intracranial hemorrhage within 3 months'
    ],
    rationaleTemplate: 'Sudden onset catastrophic dyspnea, severe hypoxemia refractory to oxygen, right ventricular strain, and hemodynamic instability.'
  },
  {
    id: 'asthma-copd-exacerbation',
    name: 'Severe Acute Bronchial Asthma Exacerbation',
    icd10: 'J45.9',
    category: 'Respiratory',
    priorProbability: 0.14,
    vitalDistributions: {
      spO2: { mean: 91, std: 3 },
      heartRate: { mean: 114, std: 10 },
      bloodPressureSys: { mean: 135, std: 15 },
      respiratoryRate: { mean: 28, std: 4 },
      temperature: { mean: 98.9, std: 0.7 },
      bloodGlucose: { mean: 120, std: 20 }
    },
    symptomLikelihoods: {
      'productive_cough': 0.65,
      'rust_sputum': 0.05,
      'pleuritic_chest_pain': 0.25,
      'high_fever': 0.10,
      'dyspnea': 0.94,
      'tachycardia': 0.85,
      'crushing_chest_pain': 0.05,
      'diaphoresis': 0.50,
      'kussmaul_breathing': 0.08,
      'pigmented_lesion': 0.01,
      'asymmetric_borders': 0.01,
      'wheezing': 0.96,
      'headache': 0.15
    },
    recommendedWorkup: [
      'Peak Expiratory Flow (PEF) measurement before and after bronchodilator',
      'Serial SpO2 and Arterial Blood Gas (look for pseudonormalization of PaCO2 signaling fatigue)',
      'Chest Radiograph to exclude pneumothorax or superimposed consolidation'
    ],
    firstLineTherapy: [
      'Nebulized Salbutamol 5mg + Ipratropium Bromide 0.5mg every 20 minutes',
      'Systemic Corticosteroids: IV Hydrocortisone 100mg or Oral Prednisolone 40mg',
      'IV Magnesium Sulfate 2g infusion over 20 minutes for severe refractory bronchospasm'
    ],
    contraindications: [
      'CONTRAINDICATION: Sedatives or anxiolytics (depresses respiratory drive and accelerates respiratory arrest)'
    ],
    rationaleTemplate: 'Obstructive expiratory wheezing, tachypnea, pulsus paradoxus, and response to beta-2 adrenergic agonists.'
  }
];

// Gaussian Probability Density Function
function gaussianProbability(val: number, mean: number, std: number): number {
  const safeStd = Math.max(std, 0.5);
  const exponent = -Math.pow(val - mean, 2) / (2 * Math.pow(safeStd, 2));
  return (1 / (safeStd * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

export interface BayesianInferenceResult {
  diseaseId: string;
  name: string;
  icd10: string;
  category: string;
  posteriorProbability: number; // 0.0 to 1.0 (sums to 1 across candidates)
  vitalLogLikelihood: number;
  symptomLogLikelihood: number;
  totalLogPosterior: number;
  recommendedWorkup: string[];
  firstLineTherapy: string[];
  contraindications: string[];
  rationale: string;
}

export function computeDynamicBayesianDiagnosis(
  vitals: {
    spO2: number;
    heartRate: number;
    bloodPressureSys: number;
    respiratoryRate: number;
    temperature: number;
    bloodGlucose: number;
  },
  activeSymptoms: string[]
): BayesianInferenceResult[] {
  const logPosteriors: { disease: DiseaseProfile; vitalLog: number; sympLog: number; totalLog: number }[] = [];

  for (const disease of CLINICAL_DISEASE_KB) {
    let vitalLog = 0;

    // Continuous Gaussian likelihoods for each physiological vital
    const pSpO2 = gaussianProbability(vitals.spO2, disease.vitalDistributions.spO2.mean, disease.vitalDistributions.spO2.std);
    const pHR = gaussianProbability(vitals.heartRate, disease.vitalDistributions.heartRate.mean, disease.vitalDistributions.heartRate.std);
    const pBP = gaussianProbability(vitals.bloodPressureSys, disease.vitalDistributions.bloodPressureSys.mean, disease.vitalDistributions.bloodPressureSys.std);
    const pRR = gaussianProbability(vitals.respiratoryRate, disease.vitalDistributions.respiratoryRate.mean, disease.vitalDistributions.respiratoryRate.std);
    const pTemp = gaussianProbability(vitals.temperature, disease.vitalDistributions.temperature.mean, disease.vitalDistributions.temperature.std);
    const pGlucose = gaussianProbability(vitals.bloodGlucose, disease.vitalDistributions.bloodGlucose.mean, disease.vitalDistributions.bloodGlucose.std);

    vitalLog += Math.log(Math.max(pSpO2, 1e-8));
    vitalLog += Math.log(Math.max(pHR, 1e-8));
    vitalLog += Math.log(Math.max(pBP, 1e-8));
    vitalLog += Math.log(Math.max(pRR, 1e-8));
    vitalLog += Math.log(Math.max(pTemp, 1e-8));
    vitalLog += Math.log(Math.max(pGlucose, 1e-8));

    // Discrete Bernoulli likelihoods for observed symptoms
    let sympLog = 0;
    const allKnownSymptoms = Object.keys(disease.symptomLikelihoods);

    for (const symp of allKnownSymptoms) {
      const isPresent = activeSymptoms.includes(symp);
      const pPresent = disease.symptomLikelihoods[symp] || 0.05;
      if (isPresent) {
        sympLog += Math.log(pPresent);
      } else {
        sympLog += Math.log(1 - pPresent);
      }
    }

    const priorLog = Math.log(disease.priorProbability);
    const totalLog = priorLog + vitalLog + sympLog;

    logPosteriors.push({
      disease,
      vitalLog: Number(vitalLog.toFixed(2)),
      sympLog: Number(sympLog.toFixed(2)),
      totalLog
    });
  }

  // Softmax normalization in log space to avoid numerical underflow
  const maxLog = Math.max(...logPosteriors.map(lp => lp.totalLog));
  const expValues = logPosteriors.map(lp => Math.exp(lp.totalLog - maxLog));
  const sumExp = expValues.reduce((sum, val) => sum + val, 0);

  const results: BayesianInferenceResult[] = logPosteriors.map((lp, idx) => {
    const probability = expValues[idx] / sumExp;
    return {
      diseaseId: lp.disease.id,
      name: lp.disease.name,
      icd10: lp.disease.icd10,
      category: lp.disease.category,
      posteriorProbability: Number(probability.toFixed(4)),
      vitalLogLikelihood: lp.vitalLog,
      symptomLogLikelihood: lp.sympLog,
      totalLogPosterior: Number(lp.totalLog.toFixed(2)),
      recommendedWorkup: lp.disease.recommendedWorkup,
      firstLineTherapy: lp.disease.firstLineTherapy,
      contraindications: lp.disease.contraindications,
      rationale: lp.disease.rationaleTemplate
    };
  });

  // Sort descending by posterior probability
  return results.sort((a, b) => b.posteriorProbability - a.posteriorProbability);
}

