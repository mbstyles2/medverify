export type UserRole = 'Admin' | 'Consumer' | 'Pharmacy' | 'Manufacturer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  details?: Record<string, any>;
  createdAt?: string;
}

export interface Medicine {
  id: number;
  name: string;
  manufacturer: string;
  dosage: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Batch {
  id: number;
  batchNumber: string;
  mfgDate: string;
  expDate: string;
  MedicineId: number;
  Medicine?: Medicine;
  createdAt?: string;
}

export interface SerialCode {
  id: number;
  code: string;
  scanCount: number;
  status: 'Active' | 'Recalled' | 'Suspicious';
  BatchId: number;
  Batch?: Batch & { Medicine?: Medicine };
  createdAt?: string;
}

export interface ScanLog {
  id: number;
  location: string;
  result: 'Genuine' | 'Suspicious' | 'Expired' | 'Invalid';
  ipAddress?: string;
  createdAt: string;
  User?: User;
  SerialCode?: SerialCode;
}

export interface Report {
  id: number;
  title: string;
  comments: string;
  photoUrl?: string; // Base64 or mock URL
  status: 'Pending' | 'Investigating' | 'Resolved';
  createdAt: string;
  User?: User;
  MedicineName?: string;
  BatchNumber?: string;
}

export type ScanResultStatus = 'Genuine' | 'Suspicious' | 'Expired' | 'Invalid';

export interface VerificationResult {
  status: ScanResultStatus;
  warning: string;
  medicine?: string;
  manufacturer?: string;
  dosage?: string;
  batch?: string;
  mfgDate?: string;
  expiry?: string;
  scanHistoryCount?: number;
  timestamp: string;
  detailsExplanation?: string; // AI generated or default safe instructions
}
