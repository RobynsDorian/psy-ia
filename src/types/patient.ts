
export interface Patient {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'M' | 'F' | 'Autre';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PatientFormData = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;
