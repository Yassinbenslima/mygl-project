import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse, SessionFilter } from '../interfaces/api-response.interface';
import { Session, Teacher, Grade, WeeklySchedule } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    })
  };

  constructor(private http: HttpClient) {}

  private getToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  private updateHeaders(): void {
    this.httpOptions.headers = this.httpOptions.headers.set(
      'Authorization', 
      `Bearer ${this.getToken()}`
    );
  }

  // Session Management
  getSessions(filter?: SessionFilter): Observable<Session[]> {
    this.updateHeaders();
    let params = new HttpParams();
    
    if (filter) {
      if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
      if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
      if (filter.gradeId) params = params.set('gradeId', filter.gradeId.toString());
      if (filter.department) params = params.set('department', filter.department);
      if (filter.status) params = params.set('status', filter.status);
      if (filter.availableOnly) params = params.set('availableOnly', 'true');
    }

    return this.http.get<ApiResponse<Session[]>>(`${this.apiUrl}/sessions`, { 
      headers: this.httpOptions.headers, 
      params 
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getSessionById(id: number): Observable<Session> {
    this.updateHeaders();
    return this.http.get<ApiResponse<Session>>(`${this.apiUrl}/sessions/${id}`, this.httpOptions).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  createSession(session: Partial<Session>): Observable<Session> {
    this.updateHeaders();
    return this.http.post<ApiResponse<Session>>(`${this.apiUrl}/sessions`, session, this.httpOptions).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  updateSession(id: number, session: Partial<Session>): Observable<Session> {
    this.updateHeaders();
    return this.http.put<ApiResponse<Session>>(`${this.apiUrl}/sessions/${id}`, session, this.httpOptions).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  deleteSession(id: number): Observable<boolean> {
    this.updateHeaders();
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/sessions/${id}`, this.httpOptions).pipe(
      map(response => response.success),
      catchError(this.handleError)
    );
  }

  // Spring Boot API Integration
  getTeachers(): Observable<any[]> {
    this.updateHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/enseignant/all`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAllSeances(): Observable<any[]> {
    this.updateHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/get/Allseances`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  assignSeancesToEnseignant(enseignantId: number, seanceIds: number[]): Observable<any> {
    this.updateHeaders();
    return this.http.post<any>(`${this.apiUrl}/enseignant/add-sceances`, {
      enseignantId: enseignantId,
      seanceIds: seanceIds
    }, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getTeacherById(id: number): Observable<Teacher> {
    this.updateHeaders();
    return this.http.get<ApiResponse<Teacher>>(`${this.apiUrl}/teachers/${id}`, this.httpOptions).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getCurrentTeacher(): Observable<Teacher> {
    this.updateHeaders();
    return this.http.get<ApiResponse<Teacher>>(`${this.apiUrl}/teachers/current`, this.httpOptions).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Preference Management
  submitPreferences(sessionPreferences: { sessionId: number; priority: number }[]): Observable<boolean> {
    this.updateHeaders();
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/preferences`, 
      { preferences: sessionPreferences }, 
      this.httpOptions
    ).pipe(
      map(response => response.success),
      catchError(this.handleError)
    );
  }

  getTeacherPreferences(teacherId: number): Observable<any[]> {
    this.updateHeaders();
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/preferences/teacher/${teacherId}`, this.httpOptions).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Calendar and Schedule
  getWeeklySchedule(weekStart: Date): Observable<WeeklySchedule> {
    this.updateHeaders();
    const params = new HttpParams().set('weekStart', weekStart.toISOString());
    
    return this.http.get<ApiResponse<WeeklySchedule>>(`${this.apiUrl}/schedule/weekly`, { 
      headers: this.httpOptions.headers, 
      params 
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getMonthlySchedule(year: number, month: number): Observable<Session[]> {
    this.updateHeaders();
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    
    return this.http.get<ApiResponse<Session[]>>(`${this.apiUrl}/schedule/monthly`, { 
      headers: this.httpOptions.headers, 
      params 
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Statistics
  getDashboardStats(): Observable<any> {
    this.updateHeaders();
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/dashboard/stats`, this.httpOptions).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getTeacherStats(teacherId: number): Observable<any> {
    this.updateHeaders();
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/teachers/${teacherId}/stats`, this.httpOptions).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Grade Management
  getGrades(): Observable<Grade[]> {
    this.updateHeaders();
    return this.http.get<ApiResponse<Grade[]>>(`${this.apiUrl}/grades`, this.httpOptions).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    throw error;
  }
}
