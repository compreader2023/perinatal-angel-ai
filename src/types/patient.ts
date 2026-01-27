export type RiskLevel = 'high' | 'medium' | 'low';

export type ConnectionStatus = 'connected' | 'error' | 'pending' | 'disconnected';

export type UserRole = 'admin' | 'doctor' | 'nurse';

export interface RiskHistory {
  date: string;
  level: RiskLevel;
  probability: number;
}

export interface MedicalRecord {
  date: string;
  bloodOxygen: number;
  bloodPressureSBP: number;
  bloodPressureDBP: number;
  heartRate: number;
  fetalHeartRate: number;
  amnioticFluidIndex: string;
  notes: string;
}

export interface Patient {
  id: string;
  name: string;
  admissionNumber: string;
  expectedDueDate: string;
  admissionDate: string;
  age: number;
  gestationalWeeks: number;
  currentRisk: RiskLevel;
  currentProbability: number;
  emrStatus: ConnectionStatus;
  riskHistory: RiskHistory[];
  medicalRecords: MedicalRecord[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  assignedPatients?: string[];
}

// Manual Detection Form Data
export interface ManualDetectionData {
  // 基本信息
  name: string;
  admissionNumber: string;
  age: number;
  
  // 常规数据
  complications: string;
  adversePregnancyHistory: boolean;
  weightGain: number;
  bmi: number;
  pregnancyCount: number;
  deliveryCount: number;
  abnormalFetalMovement: boolean;
  admissionDiagnosis: string;
  
  // 胎监时孕妇数据
  bloodOxygen: number;
  bloodPressureSBP: number;
  bloodPressureDBP: number;
  heartRate: number;
  
  // 超声检查
  gestationalWeeks: number;
  amnioticFluidIndex: string;
  placentaGrade: string;
  placentaPosition: string;
  umbilicalBloodFlowRatio: number;
  cerebralArteryRatio: number;
  umbilicalCordAroundNeck: boolean;
  
  // 分娩数据
  painlessDelivery: boolean;
  specialMedication: boolean;
  preDeliverySBP: number;
  preDeliveryDBP: number;
  postDeliverySBP: number;
  postDeliveryDBP: number;
  dischargeDiagnosis: string;
  amnioticFluidNature: boolean;
  postpartumHemorrhage: boolean;
  prematureRuptureOfMembranes: boolean;
  placentaPrevia: boolean;
  placentalAbruption: boolean;
  scarredUterus: boolean;
  uterineRupture: boolean;
  secondaryUterineInertia: boolean;
  abnormalLabor: boolean;
  deliveryMethod: string;
  abnormalLaborStage: string;
  
  // 胎儿数据
  fetalHeartRate: number;
  uterineContraction: number;
  multipleFetalHearts: boolean;
  
  // 新生儿数据
  asphyxia: boolean;
  asphyxiaDegree: string;
  resuscitationStatus: string;
  gender: string;
  birthWeight: number;
  birthCondition: string;
  apgar1min: number;
  apgar5min: number;
  umbilicalArteryPH: number;
  baseExcess: number;
  lactateCO2Pressure: number;
  neonatalPneumonia: boolean;
  transferred: boolean;
}
