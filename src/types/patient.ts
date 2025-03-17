
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

// Type pour l'affichage dans la liste (sans données confidentielles)
export type PatientListItem = Pick<Patient, 'id' | 'code' | 'age' | 'gender' | 'createdAt'>;
