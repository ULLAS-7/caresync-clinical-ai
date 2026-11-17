import { PatientProfile, TriageScore } from '../types/clinical';

export function calculateNEWS2AndESI(patient: PatientProfile): TriageScore {
  const { vitals, consciousness } = patient;
  let score = 0;
  const urgentFlags: string[] = [];

  // 1. Respiratory Rate
  if (vitals.respiratoryRate <= 8) {
    score += 3;
    urgentFlags.push(`Critical Bradypnea: RR ${vitals.respiratoryRate}/min (≤8)`);
  } else if (vitals.respiratoryRate >= 9 && vitals.respiratoryRate <= 11) {
    score += 1;
  } else if (vitals.respiratoryRate >= 21 && vitals.respiratoryRate <= 24) {
    score += 2;
    urgentFlags.push(`Tachypnea: RR ${vitals.respiratoryRate}/min`);
  } else if (vitals.respiratoryRate >= 25) {
    score += 3;
    urgentFlags.push(`Severe Tachypnea: RR ${vitals.respiratoryRate}/min (≥25)`);
  }

  // 2. Oxygen Saturation (SpO2)
  if (vitals.spO2 <= 91) {
    score += 3;
    urgentFlags.push(`Critical Hypoxemia: SpO2 ${vitals.spO2}% (≤91%)`);
  } else if (vitals.spO2 >= 92 && vitals.spO2 <= 93) {
    score += 2;
    urgentFlags.push(`Moderate Hypoxia: SpO2 ${vitals.spO2}%`);
  } else if (vitals.spO2 >= 94 && vitals.spO2 <= 95) {
    score += 1;
  }

  // 3. Systolic Blood Pressure
  if (vitals.bloodPressureSys <= 90) {
    score += 3;
    urgentFlags.push(`Hypotension / Shock: SBP ${vitals.bloodPressureSys} mmHg (≤90)`);
  } else if (vitals.bloodPressureSys >= 91 && vitals.bloodPressureSys <= 100) {
    score += 2;
  } else if (vitals.bloodPressureSys >= 101 && vitals.bloodPressureSys <= 110) {
    score += 1;
  } else if (vitals.bloodPressureSys >= 220) {
    score += 3;
    urgentFlags.push(`Hypertensive Emergency: SBP ${vitals.bloodPressureSys} mmHg (≥220)`);
  }

  // 4. Heart Rate
  if (vitals.heartRate <= 40) {
    score += 3;
    urgentFlags.push(`Severe Bradycardia: HR ${vitals.heartRate} bpm (≤40)`);
  } else if (vitals.heartRate >= 41 && vitals.heartRate <= 50) {
    score += 1;
  } else if (vitals.heartRate >= 91 && vitals.heartRate <= 110) {
    score += 1;
  } else if (vitals.heartRate >= 111 && vitals.heartRate <= 130) {
    score += 2;
    urgentFlags.push(`Tachycardia: HR ${vitals.heartRate} bpm`);
  } else if (vitals.heartRate >= 131) {
    score += 3;
    urgentFlags.push(`Critical Tachycardia: HR ${vitals.heartRate} bpm (≥131)`);
  }

  // 5. Consciousness Level
  if (consciousness !== 'Alert') {
    score += 3;
    urgentFlags.push(`Altered Mental State: ${consciousness}`);
  }

  // 6. Temperature (°F)
  if (vitals.temperature <= 95.0) {
    score += 3;
    urgentFlags.push(`Hypothermia: Temp ${vitals.temperature}°F`);
  } else if (vitals.temperature >= 95.1 && vitals.temperature <= 96.8) {
    score += 1;
  } else if (vitals.temperature >= 100.5 && vitals.temperature <= 102.2) {
    score += 1;
  } else if (vitals.temperature >= 102.3) {
    score += 2;
    urgentFlags.push(`High Grade Pyrexia: Temp ${vitals.temperature}°F (≥102.3)`);
  }

  // Determine Risk Category & ESI Level
  let news2Risk: 'Low' | 'Medium' | 'High';
  let esiLevel: 1 | 2 | 3 | 4 | 5;
  let recommendation = '';
  let colorCode: '#ef4444' | '#f97316' | '#eab308' | '#22c55e' | '#3b82f6';

  if (score >= 7 || consciousness === 'Unresponsive' || vitals.spO2 <= 85 || vitals.bloodPressureSys <= 80) {
    news2Risk = 'High';
    esiLevel = consciousness === 'Unresponsive' ? 1 : 2;
    recommendation = 'EMERGENCY CLINICAL ALERT: Urgent specialist medical review required immediately. Prepare rapid stabilization and emergency ambulance transfer.';
    colorCode = '#ef4444';
  } else if (score >= 5 || (score >= 1 && urgentFlags.some(f => f.includes('Critical')))) {
    news2Risk = 'Medium';
    esiLevel = 2;
    recommendation = 'HIGH CLINICAL ATTENTION: Urgent assessment by PHC Medical Officer within 30 minutes. Monitor vitals every 15-30 minutes.';
    colorCode = '#f97316';
  } else if (score >= 1) {
    news2Risk = 'Low';
    esiLevel = 3;
    recommendation = 'STANDARD ADMISSION TRIAGE: Nurse assessment and diagnostic workup indicated. Monitor vitals 4-hourly.';
    colorCode = '#eab308';
  } else {
    news2Risk = 'Low';
    esiLevel = 4;
    recommendation = 'ROUTINE WARD / OUTPATIENT: Clinical parameters stable. Standard OPD management and oral medications.';
    colorCode = '#22c55e';
  }

  return {
    news2Score: score,
    news2Risk,
    esiLevel,
    recommendation,
    urgentFlags,
    colorCode
  };
}

