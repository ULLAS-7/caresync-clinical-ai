import { PatientProfile, MedicalImageAnalysis, RAGEvidence, DifferentialDiagnosis, EdgeBenchmark } from '../types/clinical';

export const PRESET_PATIENTS: PatientProfile[] = [
  {
    id: 'pt-001',
    name: 'Ramesh Gowda',
    age: 62,
    gender: 'Male',
    location: 'Mandya Rural PHC (Karnataka)',
    language: 'Kannada',
    vitals: {
      heartRate: 112,
      bloodPressureSys: 98,
      bloodPressureDia: 62,
      spO2: 88,
      respiratoryRate: 28,
      temperature: 102.4,
      bloodGlucose: 145
    },
    consciousness: 'Alert',
    chiefComplaint: 'Severe breathlessness, high fever, and productive rust-colored cough for 4 days.',
    symptoms: ['Dyspnea on minimal exertion', 'High grade fever with rigors', 'Pleuritic chest pain (Right side)', 'Rust-colored sputum', 'Tachycardia'],
    durationDays: 4,
    allergies: ['Penicillin / Amoxicillin (Severe Anaphylaxis)'],
    comorbidities: ['Type 2 Diabetes (6 yrs)', 'Mild COPD']
  },
  {
    id: 'pt-002',
    name: 'Lakshmi Devi',
    age: 58,
    gender: 'Female',
    location: 'Kolar Sub-Divisional Hospital',
    language: 'Telugu',
    vitals: {
      heartRate: 106,
      bloodPressureSys: 172,
      bloodPressureDia: 102,
      spO2: 95,
      respiratoryRate: 22,
      temperature: 98.6,
      bloodGlucose: 218
    },
    consciousness: 'Alert',
    chiefComplaint: 'Crushing central chest tightness radiating to left shoulder and jaw with cold diaphoresis.',
    symptoms: ['Retrosternal squeezing pain', 'Cold sweating (diaphoresis)', 'Nausea and epigastric discomfort', 'Radiation to left arm and jaw'],
    durationDays: 1,
    allergies: ['None known'],
    comorbidities: ['Hypertension (10 yrs)', 'Hyperlipidemia']
  },
  {
    id: 'pt-003',
    name: 'Anand Kumar',
    age: 44,
    gender: 'Male',
    location: 'Chikkaballapur Community Health Centre',
    language: 'Hindi',
    vitals: {
      heartRate: 74,
      bloodPressureSys: 124,
      bloodPressureDia: 78,
      spO2: 99,
      respiratoryRate: 16,
      temperature: 98.4,
      bloodGlucose: 108
    },
    consciousness: 'Alert',
    chiefComplaint: 'Rapidly enlarging pigmented skin lesion on upper back with irregular color variation and itchiness.',
    symptoms: ['Asymmetrical pigmented mole', 'Border irregularity', 'Color variegation (black/brown/blue)', 'Diameter > 7mm', 'Intermittent pruritus'],
    durationDays: 45,
    allergies: ['Sulfa drugs'],
    comorbidities: ['No major systemic disease']
  }
];

export const PRESET_IMAGE_CASES: Record<string, MedicalImageAnalysis> = {
  'pt-001': {
    id: 'img-xray-pneumonia',
    modality: 'Chest_XRay',
    caseName: 'Bilateral PA Chest X-Ray: Lobar Pneumonia',
    anatomicalRegion: 'Right Lower Lobe (RLL) Parenchyma',
    findings: [
      { condition: 'Right Lower Lobe Consolidation', confidence: 0.942, severity: 'Severe', icdCode: 'J18.9' },
      { condition: 'Air Bronchogram Sign', confidence: 0.895, severity: 'Moderate' },
      { condition: 'Mild Parapneumonic Pleural Effusion', confidence: 0.724, severity: 'Mild' }
    ],
    gradCamExplanation: 'BioCLIP & Med-ViT activation demonstrates hyper-dense focal attenuation concentrated over the right medial base and retrocardiac zone, sparing the apices.',
    gradCamOverlay: 'RLL Focal Opacity (x: 58%, y: 64%, radius: 85px)',
    rawImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
  },
  'pt-002': {
    id: 'img-ecg-stemi',
    modality: 'Chest_XRay',
    caseName: 'Portable AP Chest Radiograph: Cardiac Silhouette',
    anatomicalRegion: 'Cardiovascular Contour & Pulmonary Vasculature',
    findings: [
      { condition: 'Cardiomegaly (CTR > 0.55)', confidence: 0.887, severity: 'Moderate', icdCode: 'I51.7' },
      { condition: 'Mild Cephalization of Pulmonary Blood Flow', confidence: 0.762, severity: 'Mild' }
    ],
    gradCamExplanation: 'Cardiothoracic ratio elevated; subtle bilateral perihilar haziness indicative of early pulmonary vascular congestion.',
    gradCamOverlay: 'Central mediastinal enlargement (CTR: 0.58)',
    rawImageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80'
  },
  'pt-003': {
    id: 'img-derm-melanoma',
    modality: 'Dermoscopy',
    caseName: 'High-Resolution Epiluminescence Dermoscopy',
    anatomicalRegion: 'Upper Thoracic Cutaneous Tissue',
    findings: [
      { condition: 'Superficial Spreading Melanoma', confidence: 0.918, severity: 'Critical', icdCode: 'C43.9' },
      { condition: 'Atypical Pigment Network & Blue-White Veil', confidence: 0.884, severity: 'Severe' }
    ],
    gradCamExplanation: 'Significant asymmetric structural chaos, peripheral pseudopods, and regression structures marked by blue-gray granular pigment.',
    gradCamOverlay: 'Asymmetric border perimeter with focal melanin clustering',
    rawImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
  }
};

export const CLINICAL_EVIDENCE_KB: Record<string, RAGEvidence[]> = {
  'pt-001': [
    {
      pmid: '32847521',
      title: 'ICMR Guidelines for Management of Community-Acquired Pneumonia in Primary & Secondary Healthcare',
      journal: 'Indian Journal of Medical Research',
      year: 2023,
      excerpt: 'In severe CAP with SpO2 < 90% or RR > 28, immediate supplemental oxygen and parenteral antibiotic therapy is indicated. If beta-lactam allergy is present, Levofloxacin (750mg IV/PO q24h) or Moxifloxacin (400mg) is the recommended first-line monotherapy.',
      relevanceScore: 0.965,
      source: 'ICMR_Guideline',
      doiOrUrl: 'https://pubmed.ncbi.nlm.nih.gov/32847521'
    },
    {
      pmid: '31592670',
      title: 'Diagnosis and Treatment of Adults with Community-acquired Pneumonia. Official Clinical Practice Guideline of the ATS/IDSA',
      journal: 'American Journal of Respiratory and Critical Care Medicine',
      year: 2022,
      excerpt: 'Severe inpatient pneumonia criteria: respiratory rate >= 30, PaO2/FiO2 <= 250, multilobar infiltrates, confusion, uremia, leukopenia, thrombocytopenia, hypothermia, or hypotension. Sputum Gram stain and blood cultures should be drawn prior to initiation.',
      relevanceScore: 0.932,
      source: 'WHO_Clinical_Protocol',
      doiOrUrl: 'https://pubmed.ncbi.nlm.nih.gov/31592670'
    }
  ],
  'pt-002': [
    {
      pmid: '34483755',
      title: '2023 ESC Guidelines for the management of acute coronary syndromes',
      journal: 'European Heart Journal',
      year: 2023,
      excerpt: 'Immediate loading dose of Aspirin 300mg + Ticagrelor 180mg (or Clopidogrel 300-600mg) followed by continuous cardiac monitoring and rapid tele-triage dispatch to primary PCI-capable hospital within 90 minutes.',
      relevanceScore: 0.982,
      source: 'PubMed_Central',
      doiOrUrl: 'https://pubmed.ncbi.nlm.nih.gov/34483755'
    }
  ],
  'pt-003': [
    {
      pmid: '31707248',
      title: 'Dermoscopic Criteria for Malignant Melanoma vs Dysplastic Nevi: A Multi-Center Consensus',
      journal: 'Journal of the American Academy of Dermatology',
      year: 2021,
      excerpt: 'Lesions exhibiting atypical pigment network, irregular dots/globules, and blue-white structures require full-thickness narrow margin (1-2mm) excisional biopsy. Shave biopsy is contraindicated due to risk of incorrect Breslow thickness measurement.',
      relevanceScore: 0.941,
      source: 'PubMed_Central',
      doiOrUrl: 'https://pubmed.ncbi.nlm.nih.gov/31707248'
    }
  ]
};

export const CLINICAL_DIAGNOSES: Record<string, DifferentialDiagnosis[]> = {
  'pt-001': [
    {
      disease: 'Severe Community-Acquired Pneumonia (CAP) with Hypoxemic Respiratory Failure',
      probability: 0.88,
      icd10: 'J18.9',
      rationale: 'Marked tachypnea (RR 28), SpO2 88%, fever, elevated pulse, and radiographic confirmation of dense right lower lobe consolidation with air bronchograms.',
      recommendedTests: [
        'Arterial Blood Gas (ABG) for PaO2/PaCO2',
        'Complete Blood Count with differential (look for leukocytosis/neutrophilia)',
        'Sputum Gram Stain & Sputum Culture',
        'Blood Cultures x 2 sets',
        'Serum Creatinine & Blood Urea Nitrogen (CURB-65 calculation)'
      ],
      firstLineTreatment: [
        'Immediate High-Flow Oxygen via Venturi Mask to target SpO2 >= 92%',
        'IV Levofloxacin 750mg q24h (PENICILLIN ALLERGY SUBSTITUTION)',
        'IV Fluid Resuscitation (Balanced crystalloids 500mL bolus)',
        'Antipyretic: Paracetamol 1g IV for rigors and temperature > 101°F'
      ],
      contraindications: [
        'STRICT CONTRAINDICATION: Amoxicillin-Clavulanate or Ampicillin (Patient has severe Penicillin Anaphylaxis history)'
      ]
    },
    {
      disease: 'Acute Exacerbation of Chronic Obstructive Pulmonary Disease (AECOPD)',
      probability: 0.10,
      icd10: 'J44.1',
      rationale: 'Underlying COPD history contributes to respiratory fatigue, but focal unilateral radiographic consolidation strongly favors primary bacterial infection.',
      recommendedTests: ['Serial peak expiratory flow (PEF)', 'Repeat chest radiograph in 48 hours'],
      firstLineTreatment: ['Nebulized Ipratropium + Salbutamol', 'Short-course oral corticosteroids if wheezing present'],
      contraindications: ['Avoid unguided high concentration 100% O2 without CO2 monitoring in chronic retainers']
    }
  ],
  'pt-002': [
    {
      disease: 'Acute ST-Elevation Myocardial Infarction (STEMI) / High-Risk ACS',
      probability: 0.92,
      icd10: 'I21.9',
      rationale: 'Classic crushing substernal radiation, cold diaphoresis, severe hypertension, and autonomic symptoms in a diabetic female patient.',
      recommendedTests: [
        'Immediate 12-Lead ECG within 10 minutes of arrival',
        'High-Sensitivity Cardiac Troponin I/T (hs-cTn)',
        'Bedside Echocardiogram for Regional Wall Motion Abnormality (RWMA)',
        'Continuous rhythm telemetry for ventricular dysrhythmias'
      ],
      firstLineTreatment: [
        'Dispersible Aspirin 300mg chewed immediately',
        'Loading dose Clopidogrel 300mg PO or Ticagrelor 180mg PO',
        'Sublingual Nitroglycerin 0.4mg (if SBP > 100 mmHg and no phosphodiesterase-5 inhibitors)',
        'Emergency 108 Ambulance Dispatch with tele-ECG relay to Tertiary Cath Lab'
      ],
      contraindications: [
        'Do not give Nitrates if SBP < 90 mmHg or right ventricular infarction suspected'
      ]
    }
  ],
  'pt-003': [
    {
      disease: 'Cutaneous Malignant Melanoma (Superficial Spreading Subtype)',
      probability: 0.89,
      icd10: 'C43.9',
      rationale: 'ABCDE criteria completely positive (Asymmetry, Border irregularity, Color variegation, Diameter 8mm, Evolution over 45 days). Dermoscopy reveals classic blue-white veil and atypical network.',
      recommendedTests: [
        'Full-thickness excisional biopsy with 2mm lateral margins and subcutaneous cuff',
        'Histopathological Breslow depth assessment',
        'Regional lymph node ultrasound if Breslow depth > 0.8mm'
      ],
      firstLineTreatment: [
        'Urgent surgical referral to Surgical Oncology / Dermatology within 7 days',
        'Patient counseling: Avoid topical steroid or chemical cautery applications'
      ],
      contraindications: [
        'DO NOT perform partial shave or punch biopsy through center of lesion (compromises staging accuracy)'
      ]
    }
  ]
};

export const EDGE_MODEL_BENCHMARKS: EdgeBenchmark[] = [
  {
    modelName: 'Med-Gemma-2B (Custom Edge LoRA)',
    quantization: '4-bit GGUF (Q4_K_M)',
    tokensPerSec: 42.6,
    vramMB: 1840,
    latencyMs: 145,
    memoryFootprintMB: 1650,
    accuracyRetention: '96.8% vs FP16'
  },
  {
    modelName: 'Llama-3.2-3B-Clinical-Instruct',
    quantization: '4-bit AWQ / GGUF',
    tokensPerSec: 36.2,
    vramMB: 2350,
    latencyMs: 180,
    memoryFootprintMB: 2200,
    accuracyRetention: '97.4% vs FP16'
  },
  {
    modelName: 'Qwen-2.5-7B-Medical-Edge',
    quantization: '4-bit GGUF (Q4_0)',
    tokensPerSec: 21.4,
    vramMB: 4680,
    latencyMs: 310,
    memoryFootprintMB: 4400,
    accuracyRetention: '98.9% vs FP16'
  },
  {
    modelName: 'Cloud GPT-4o / Claude 3.5 Sonnet (Benchmark Reference)',
    quantization: 'FP16 Cloud API',
    tokensPerSec: 65.0,
    vramMB: 0, // Remote API
    latencyMs: 1250, // High roundtrip network latency
    memoryFootprintMB: 0,
    accuracyRetention: '100% (Baseline)'
  }
];

