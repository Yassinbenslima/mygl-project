export interface Session {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
  subject: string;
  grade: Grade;
  requiredSupervisors: number;
  currentSupervisors: number;
  maxSupervisors: number;
  location: string;
  status: SessionStatus;
  supervisors: Teacher[];
  available: boolean;
  selectedByTeacher?: boolean;
}

export interface Grade {
  id: number;
  name: string;
  level: string;
  department: string;
}

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: TeacherRole;
  maxSessionsPerWeek: number;
  currentWeeklySessions: number;
  preferences: SessionPreference[];
}

export interface SessionPreference {
  sessionId: number;
  priority: number; // 1-5 (1 = highest priority)
  status: PreferenceStatus;
}

export enum SessionStatus {
  AVAILABLE = 'AVAILABLE',
  SATURATED = 'SATURATED',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED'
}

export enum TeacherRole {
  PROFESSOR = 'PROFESSOR',
  ASSISTANT_PROFESSOR = 'ASSISTANT_PROFESSOR',
  ASSISTANT = 'ASSISTANT',
  ADMIN = 'ADMIN'
}

export enum PreferenceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface WeeklySchedule {
  weekStart: Date;
  weekEnd: Date;
  sessions: Session[];
  teacherStats: TeacherWeeklyStats[];
}

export interface TeacherWeeklyStats {
  teacherId: number;
  teacherName: string;
  totalSessions: number;
  maxSessions: number;
  utilizationPercentage: number;
}

