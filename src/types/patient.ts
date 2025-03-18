
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
  id?: string;
  createdAt?: Date;
  title?: string;
}

export interface PatientSession {
  id: string;
  patientId: string;
  date: Date;
  transcription: string;
  analysis?: string;
}

export interface PatientRelationship {
  id: string;
  name: string;
  relation: string;
  description: string;
  connections: string[];
}

export interface StoryTemplate {
  id: string;
  title: string;
  type: 'children' | 'adult' | 'therapeutic';
  description: string;
}

export interface GeneratedStory {
  id: string;
  patientId: string;
  title: string;
  content: string;
  type: 'children' | 'adult' | 'therapeutic';
  createdAt: Date;
  baseTemplate?: StoryTemplate;
  pages: string[];
}

export interface StoryFormData {
  title: string;
  type: 'children' | 'adult' | 'therapeutic';
  additionalContext?: string;
}
