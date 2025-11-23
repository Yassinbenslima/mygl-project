export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SessionFilter {
  startDate?: Date;
  endDate?: Date;
  gradeId?: number;
  department?: string;
  status?: string;
  availableOnly?: boolean;
}

