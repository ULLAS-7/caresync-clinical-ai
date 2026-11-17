import { PatientProfile, TriageScore, DifferentialDiagnosis, SBARReport } from '../types/clinical';

export function generateSBARReport(
  patient: PatientProfile,
  triage: TriageScore,
  diagnosis: DifferentialDiagnosis
): SBARReport {
  const urgency = triage.news2Score >= 7 ? 'IMMEDIATE_ICU' : triage.news2Score >= 5 ? 'TRANSFER_24H' : 'OPD_SPECIALIST';

  const situation = `Patient ${patient.name}, ${patient.age}yo ${patient.gender}, presenting at ${patient.location} with acute ${patient.chiefComplaint}. Current triage status: ESI Level ${triage.esiLevel}, NEWS2 Score ${triage.news2Score} (${triage.news2Risk} Risk).`;

  const background = `Onset ${patient.durationDays} days ago. Documented comorbidities: ${patient.comorbidities.join(', ') || 'None'}. Known allergies: ${patient.allergies.join(', ') || 'None'}. Initial vitals: HR ${patient.vitals.heartRate} bpm, BP ${patient.vitals.bloodPressureSys}/${patient.vitals.bloodPressureDia} mmHg, SpO2 ${patient.vitals.spO2}%, RR ${patient.vitals.respiratoryRate}/min, Temp ${patient.vitals.temperature}°F.`;

  const assessment = `Clinical and multimodal AI analysis strongly indicates: ${diagnosis.disease} (ICD-10: ${diagnosis.icd10}, Probability: ${(diagnosis.probability * 100).toFixed(0)}%). Key findings: ${diagnosis.rationale}. Urgent physiological flags: ${triage.urgentFlags.join(' | ') || 'None'}.`;

  const recommendation = `1. Immediate transfer via ALS ambulance to higher center. 2. Continue supplemental O2 maintaining SpO2 >= 92%. 3. Initiate first-line therapy: ${diagnosis.firstLineTreatment.slice(0, 2).join('; ')}. 4. Laboratory workup upon arrival: ${diagnosis.recommendedTests.slice(0, 3).join(', ')}.`;

  return {
    situation,
    background,
    assessment,
    recommendation,
    referralUrgency: urgency,
    signedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    telemedicineID: `CARE-TEL-${Math.floor(100000 + Math.random() * 900000)}`
  };
}

