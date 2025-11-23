import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiResponse, AuthResponse, User } from '../interfaces/api-response.interface';

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  login(credentials: LoginRequest): Observable<User> {
    // Mode test - connexion directe sans API
    return new Observable(observer => {
      setTimeout(() => {
        const testUser: User = {
          id: 1,
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          role: credentials.email.includes('admin') ? 'ADMIN' : 'PROFESSOR',
          department: 'Économie'
        };

        const testToken = 'test-token-' + Date.now();
        
        // Store token and user info
        localStorage.setItem('authToken', testToken);
        localStorage.setItem('currentUser', JSON.stringify(testUser));
        localStorage.setItem('tokenExpiry', (Date.now() + (3600 * 1000)).toString());
        
        // Update subjects
        this.currentUserSubject.next(testUser);
        this.isAuthenticatedSubject.next(true);
        
        observer.next(testUser);
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tokenExpiry');
    
    // Update subjects
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Redirect to login
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value && this.isTokenValid();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  isTeacher(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'PROFESSOR' || user?.role === 'ASSISTANT_PROFESSOR' || user?.role === 'ASSISTANT';
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  refreshToken(): Observable<string> {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return throwError(() => new Error('No token to refresh'));
    }

    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/refresh`, { token })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            const newToken = response.data.token;
            localStorage.setItem('authToken', newToken);
            localStorage.setItem('tokenExpiry', (Date.now() + (response.data.expiresIn * 1000)).toString());
            return newToken;
          }
          throw new Error('Token refresh failed');
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr && this.isTokenValid()) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  private isTokenValid(): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return false;
    
    const expiryTime = parseInt(expiry);
    const currentTime = Date.now();
    
    // Check if token expires in the next 5 minutes
    return currentTime < (expiryTime - 300000);
  }

  // Route guards helper
  canActivate(): boolean {
    if (this.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  canActivateAdmin(): boolean {
    if (this.isAuthenticated() && this.isAdmin()) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }

  canActivateTeacher(): boolean {
    if (this.isAuthenticated() && this.isTeacher()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  // Redirect URL for after login
  redirectUrl: string = '';
}
