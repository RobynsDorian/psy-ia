
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

// Type for displaying in list (without confidential data)
export type PatientListItem = Pick<Patient, 'id' | 'code' | 'createdAt' | 'updatedAt'>;

export interface BackgroundSection {
  title: string;
  content: string;
  icon: "calendar" | "graduation" | "home" | "heart";
}

export interface GeneratedBackground {
  summary: string;
  sections: BackgroundSection[];
}
