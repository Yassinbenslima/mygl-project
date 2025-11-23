// Interfaces for Spring Boot API data structures

export interface Enseignant {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  department: string;
  maxSessionsPerWeek?: number;
  currentWeeklySessions?: number;
  role?: string;
  seances?: Seance[];
}

export interface Seance {
  id: number;
  subject?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  grade?: {
    id: number;
    name: string;
    level?: string;
    department?: string;
  };
  enseignantId?: number;
  enseignant?: Enseignant;
  status?: 'available' | 'assigned' | 'completed' | 'cancelled';
}

export interface SeanceAssignmentRequest {
  enseignantId: number;
  seanceIds: number[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
