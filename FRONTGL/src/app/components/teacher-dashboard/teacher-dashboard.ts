import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { CalendarComponent } from '../calendar/calendar';
import { NavbarComponent } from '../shared/navbar/navbar';

import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { CalendarService } from '../../services/calendar.service';
import { Session, Teacher, SessionPreference, PreferenceStatus, SessionStatus, TeacherRole } from '../../models/session.model';
import { User } from '../../interfaces/api-response.interface';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatRadioModule,
    CalendarComponent,
    NavbarComponent
  ],
  templateUrl: './teacher-dashboard.html',
  styleUrls: ['./teacher-dashboard.scss']
})
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // User data
  currentUser: User | null = null;
  teacher: Teacher | null = null;
  
  // Dashboard data
  weeklyStats: any = {};
  upcomingSessions: Session[] = [];
  preferences: SessionPreference[] = [];
  selectedSessions: Session[] = [];
  
  // Date selection and séances
  selectedDate: Date | null = null;
  selectedDateSessions: Session[] = [];
  selectedDateSessionCounts: Map<string, number> = new Map();
  
  // Forms
  preferencesForm: FormGroup;
  
  // UI state
  isLoading = false;
  isSubmittingPreferences = false;
  selectedTabIndex = 0;
  
  // Table data
  displayedColumns: string[] = ['subject', 'grade', 'date', 'time', 'location', 'status', 'actions'];
  preferencesDisplayedColumns: string[] = ['session', 'priority', 'status', 'actions'];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    public calendarService: CalendarService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.preferencesForm = this.fb.group({
      preferences: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
    this.subscribeToCalendarSelection();
    
    // Initialize with current date
    this.selectedDate = new Date();
    this.calendarService.setCurrentDate(this.selectedDate);
    // loadSessionsForDate will be called by the subscription
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadDashboardData(): Promise<void> {
    this.isLoading = false; // Pas de chargement pour le mode test
    
    // Données de test pour le dashboard
    this.teacher = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'prof@univ-sfax.tn',
      department: 'Économie',
      role: TeacherRole.PROFESSOR,
      maxSessionsPerWeek: 10,
      currentWeeklySessions: 3,
      preferences: []
    };

    // Generate test sessions for the current week
    const today = new Date();
    const sessions: Session[] = [];
    
    // Generate sessions for the next 7 days
    for (let i = 0; i < 7; i++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(today.getDate() + i);
      
      sessions.push({
        id: i + 1,
        date: sessionDate,
        startTime: '09:00',
        endTime: '11:00',
        subject: 'Économie Générale',
        grade: { id: 1, name: 'L1 Eco', level: 'Licence', department: 'Économie' },
        requiredSupervisors: 2,
        currentSupervisors: 1,
        maxSupervisors: 2,
        location: 'Salle A101',
        status: SessionStatus.AVAILABLE,
        supervisors: [],
        available: true
      });
      
      sessions.push({
        id: i + 8,
        date: sessionDate,
        startTime: '14:00',
        endTime: '16:00',
        subject: 'Gestion Financière',
        grade: { id: 2, name: 'L2 Gestion', level: 'Licence', department: 'Gestion' },
        requiredSupervisors: 3,
        currentSupervisors: 2,
        maxSupervisors: 3,
        location: 'Salle B205',
        status: i % 3 === 0 ? SessionStatus.SATURATED : SessionStatus.AVAILABLE,
        supervisors: [],
        available: i % 3 !== 2
      });
    }
    
    this.upcomingSessions = sessions;
    this.preferences = [];
    
    // Update session counts
    this.updateSessionCounts(sessions);
  }

  private async loadTeacherData(): Promise<void> {
    if (!this.currentUser?.id) return;
    
    this.teacher = await this.apiService.getTeacherById(this.currentUser.id).toPromise() || null;
  }

  private async loadWeeklyStats(): Promise<void> {
    if (!this.teacher?.id) return;
    
    this.weeklyStats = await this.apiService.getTeacherStats(this.teacher.id).toPromise();
  }

  private async loadUpcomingSessions(): Promise<void> {
    const sessions = await this.apiService.getSessions().toPromise();
    const now = new Date();
    
    this.upcomingSessions = (sessions || [])
      .filter(session => new Date(session.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);
  }

  private async loadPreferences(): Promise<void> {
    if (!this.teacher?.id) return;
    
    this.preferences = await this.apiService.getTeacherPreferences(this.teacher.id).toPromise() || [];
  }

  private subscribeToCalendarSelection(): void {
    this.calendarService.selectedSessions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sessions => {
        this.selectedSessions = sessions;
        this.updatePreferencesForm();
      });
    
    // Subscribe to calendar date changes
    this.calendarService.currentDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        this.selectedDate = date;
        this.loadSessionsForDate(date);
      });
  }
  
  private async loadSessionsForDate(date: Date): Promise<void> {
    try {
      // Filter sessions from already loaded data
      this.selectedDateSessions = this.upcomingSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toDateString() === date.toDateString();
      });
    } catch (error) {
      console.error('Error loading sessions for date:', error);
    }
  }
  
  private updateSessionCounts(sessions: Session[]): void {
    const countsMap = new Map<string, number>();
    
    sessions.forEach(session => {
      const dateKey = new Date(session.date).toDateString();
      const currentCount = countsMap.get(dateKey) || 0;
      countsMap.set(dateKey, currentCount + 1);
    });
    
    this.selectedDateSessionCounts = countsMap;
  }
  
  getSessionCountForDate(dateKey: string): number {
    return this.selectedDateSessionCounts.get(dateKey) || 0;
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  async confirmPreference(session: Session): Promise<void> {
    if (!this.teacher?.id) {
      this.snackBar.open('Erreur: utilisateur non connecté', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    try {
      const success = await this.apiService.submitPreferences([{
        sessionId: session.id,
        priority: 1
      }]).toPromise();
      
      if (success) {
        this.snackBar.open('Vœu confirmé avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    } catch (error) {
      console.error('Error confirming preference:', error);
      this.snackBar.open('Erreur lors de la confirmation', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  private updatePreferencesForm(): void {
    const preferencesArray = this.preferencesForm.get('preferences') as FormArray;
    preferencesArray.clear();
    
    this.selectedSessions.forEach((session, index) => {
      const preferenceGroup = this.fb.group({
        sessionId: [session.id],
        priority: [index + 1, [Validators.min(1), Validators.max(5)]],
        sessionInfo: [this.getSessionDisplayInfo(session)]
      });
      preferencesArray.push(preferenceGroup);
    });
  }

  private getSessionDisplayInfo(session: Session): string {
    const dateStr = new Date(session.date).toLocaleDateString('fr-FR');
    return `${session.subject} - ${session.grade.name} (${dateStr} ${session.startTime})`;
  }

  // Dashboard actions
  async submitPreferences(): Promise<void> {
    if (!this.preferencesForm.valid) {
      this.snackBar.open('Veuillez corriger les erreurs dans le formulaire', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isSubmittingPreferences = true;
    try {
      const formValue = this.preferencesForm.value;
      const preferences = formValue.preferences.map((p: any) => ({
        sessionId: p.sessionId,
        priority: p.priority
      }));

      const success = await this.apiService.submitPreferences(preferences).toPromise();
      
      if (success) {
        this.snackBar.open('Vœux soumis avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        this.calendarService.clearSelection();
        await this.loadPreferences();
        this.selectedTabIndex = 1; // Switch to preferences tab
      }
    } catch (error) {
      console.error('Error submitting preferences:', error);
      this.snackBar.open('Erreur lors de la soumission des vœux', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isSubmittingPreferences = false;
    }
  }

  removePreference(preference: SessionPreference): void {
    const index = this.preferences.findIndex(p => p.sessionId === preference.sessionId);
    if (index > -1) {
      this.preferences.splice(index, 1);
      this.snackBar.open('Préférence supprimée', 'Fermer', {
        duration: 2000
      });
    }
  }

  printPreferences(): void {
    window.print();
  }

  exportPreferences(): void {
    const data = this.preferences.map(p => ({
      Session: this.getSessionDisplayInfo(this.upcomingSessions.find(s => s.id === p.sessionId) || {} as Session),
      Priorité: p.priority,
      Statut: this.getPreferenceStatusText(p.status)
    }));

    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const fileName = `preferences_${this.currentUser?.firstName || 'user'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ];
    return csvRows.join('\n');
  }

  getPreferenceStatusText(status: PreferenceStatus): string {
    switch (status) {
      case PreferenceStatus.PENDING:
        return 'En attente';
      case PreferenceStatus.APPROVED:
        return 'Approuvé';
      case PreferenceStatus.REJECTED:
        return 'Rejeté';
      default:
        return 'Inconnu';
    }
  }

  // Getters for template
  get weeklyUtilization(): number {
    if (!this.teacher) return 0;
    return (this.teacher.currentWeeklySessions / this.teacher.maxSessionsPerWeek) * 100;
  }

  get utilizationColor(): string {
    const utilization = this.weeklyUtilization;
    if (utilization < 50) return 'primary';
    if (utilization < 80) return 'accent';
    return 'warn';
  }

  get hasSelectedSessions(): boolean {
    return this.selectedSessions.length > 0;
  }

  get canSubmitPreferences(): boolean {
    return this.hasSelectedSessions && this.preferencesForm.valid;
  }

  get teacherDisplayName(): string {
    return this.teacher ? `${this.teacher.firstName} ${this.teacher.lastName}` : '';
  }

  get teacherDepartment(): string {
    return this.teacher?.department || '';
  }

  get teacherRole(): string {
    return this.teacher?.role || '';
  }

  get preferencesFormArray(): FormArray {
    return this.preferencesForm.get('preferences') as FormArray;
  }

  // New helper methods for modern design
  getInitials(): string {
    if (!this.teacher) return 'P';
    const firstName = this.teacher.firstName || '';
    const lastName = this.teacher.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getUtilizationClass(): string {
    const utilization = this.weeklyUtilization;
    if (utilization < 50) return 'good';
    if (utilization < 80) return 'warning';
    return 'danger';
  }

  getStatusIcon(): string {
    const utilization = this.weeklyUtilization;
    if (utilization < 50) return 'check_circle';
    if (utilization < 80) return 'warning';
    return 'error';
  }

  getStatusMessage(): string {
    const utilization = this.weeklyUtilization;
    if (utilization < 50) return 'Charge normale';
    if (utilization < 80) return 'Charge modérée';
    return 'Charge élevée';
  }

  getStatusIconForSession(session: Session): string {
    switch (session.status) {
      case SessionStatus.AVAILABLE:
        return 'check_circle';
      case SessionStatus.SATURATED:
        return 'warning';
      case SessionStatus.FULL:
        return 'cancel';
      case SessionStatus.CANCELLED:
        return 'block';
      default:
        return 'info';
    }
  }

  // Session actions
  viewSessionDetails(session: Session): void {
    // Implement session details dialog
    console.log('View session details:', session);
  }

  removeSessionFromSelection(session: Session): void {
    this.calendarService.deselectSession(session);
  }

  clearCalendarSelection(): void {
    this.calendarService.clearSelection();
  }
}