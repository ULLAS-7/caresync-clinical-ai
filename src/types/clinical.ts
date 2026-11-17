// CareSync AI - Clinical & System Data Types

export type ConsciousnessLevel = 'Alert' | 'Voice' | 'Pain' | 'Unresponsive';

export interface VitalsData {
  heartRate: number; // bpm
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  spO2: number; // %
  respiratoryRate: number; // breaths/min
  temperature: number; // °F
  bloodGlucose: number; // mg/dL
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  location: string;
  vitals: VitalsData;
  consciousness: ConsciousnessLevel;
  symptoms: string[];
  chiefComplaint: string;
  durationDays: number;
  allergies: string[];
  comorbidities: string[];
  voiceAudioNote?: string;
  language: 'English' | 'Hindi' | 'Kannada' | 'Tamil' | 'Telugu' | 'Bengali';
}

export interface TriageScore {
  news2Score: number;
  news2Risk: 'Low' | 'Medium' | 'High';
  esiLevel: 1 | 2 | 3 | 4 | 5; // 1: Resuscitation, 2: Emergent, 3: Urgent, 4: Less Urgent, 5: Non-urgent
  recommendation: string;
  urgentFlags: string[];
  colorCode: '#ef4444' | '#f97316' | '#eab308' | '#22c55e' | '#3b82f6';
}

export interface ImageFinding {
  condition: string;
  confidence: number;
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Mild' | 'Normal';
  icdCode?: string;
}

export interface MedicalImageAnalysis {
  id: string;
  modality: 'Chest_XRay' | 'Dermoscopy' | 'Retinal_Fundus';
  caseName: string;
  findings: ImageFinding[];
  anatomicalRegion: string;
  gradCamExplanation: string;
  gradCamOverlay: string; // SVG / Visual representation coordinates
  rawImageUrl: string;
}

export interface RAGEvidence {
  pmid: string;
  title: string;
  journal: string;
  year: number;
  excerpt: string;
  relevanceScore: number;
  source: 'WHO_Clinical_Protocol' | 'ICMR_Guideline' | 'PubMed_Central';
  doiOrUrl: string;
}

export interface DifferentialDiagnosis {
  disease: string;
  probability: number;
  icd10: string;
  rationale: string;
  recommendedTests: string[];
  firstLineTreatment: string[];
  contraindications: string[];
}

export interface EdgeBenchmark {
  modelName: string;
  quantization: string;
  tokensPerSec: number;
  vramMB: number;
  latencyMs: number;
  memoryFootprintMB: number;
  accuracyRetention: string;
}

export interface SBARReport {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  referralUrgency: 'IMMEDIATE_ICU' | 'TRANSFER_24H' | 'OPD_SPECIALIST';
  doctorOverrideNote?: string;
  signedAt: string;
  telemedicineID: string;
}

