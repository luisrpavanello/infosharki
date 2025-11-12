export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface ClassroomInfo {
  id: string;
  name: string;
  building: string;
  floor: string;
  description: string;
  capacity?: number;
  equipment?: string[];
}

export interface ProfessorInfo {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  phone?: string;
  office?: string;
}

export interface ScheduleInfo {
  id: string;
  subject: string;
  professor: string;
  classroom: string;
  time: string;
  days: string[];
  career: string;
}

export interface ContactInfo {
  id: string;
  area: string;
  email: string;
  phone: string;
  location: string;
  hours: string;
}