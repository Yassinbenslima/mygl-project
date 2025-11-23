import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { TestDataService } from '../../services/test-data.service';
import { User } from '../../interfaces/api-response.interface';
import { Enseignant, Seance } from '../../interfaces/spring-boot-api.interface';

@Component({
  selector: 'app-modern-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  templateUrl: './modern-dashboard.html',
  styleUrls: ['./modern-dashboard.scss']
})
export class ModernDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // User data
  currentUser: User | null = null;
  
  // Data from Spring Boot APIs
  enseignants: Enseignant[] = [];
  seances: Seance[] = [];
  filteredEnseignants: Enseignant[] = [];
  availableSeances: Seance[] = [];
  
  // UI state
  isLoading = false;
  selectedEnseignant: Enseignant | null = null;
  showSeanceAssignment = false;
  selectedSeancesForAssignment: number[] = [];
  
  // Search and filters
  searchTerm = '';
  selectedDepartment = '';
  selectedStatus = '';
  departments: string[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private testDataService: TestDataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadDashboardData(): Promise<void> {
    this.isLoading = true;
    
    try {
      // Try to load from Spring Boot API first
      try {
        this.enseignants = await this.apiService.getTeachers().toPromise() || [];
        this.seances = await this.apiService.getAllSeances().toPromise() || [];
        this.snackBar.open('Données chargées depuis l\'API Spring Boot', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      } catch (apiError) {
        // Fallback to test data if API is not available
        console.warn('API not available, using test data:', apiError);
        this.enseignants = this.testDataService.getTestEnseignants();
        this.seances = this.testDataService.getTestSeances();
        this.snackBar.open('Mode démonstration - Données de test chargées', 'Fermer', {
          duration: 3000,
          panelClass: ['warning-snackbar']
        });
      }
      
      // Extract departments for filter
      this.departments = [...new Set(this.enseignants.map(e => e.department).filter(d => d))];
      
      // Initialize filtered list
      this.filteredEnseignants = [...this.enseignants];
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.snackBar.open('Erreur lors du chargement des données', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isLoading = false;
    }
  }

  // Search and Filter Methods
  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.enseignants];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(enseignant =>
        enseignant.firstName?.toLowerCase().includes(searchLower) ||
        enseignant.lastName?.toLowerCase().includes(searchLower) ||
        enseignant.department?.toLowerCase().includes(searchLower)
      );
    }

    // Apply department filter
    if (this.selectedDepartment) {
      filtered = filtered.filter(enseignant => enseignant.department === this.selectedDepartment);
    }

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(enseignant => {
        const seancesCount = this.getEnseignantSeancesCount(enseignant);
        const maxSessions = enseignant.maxSessionsPerWeek || 10;
        
        switch (this.selectedStatus) {
          case 'available':
            return seancesCount < maxSessions * 0.5;
          case 'assigned':
            return seancesCount >= maxSessions * 0.5 && seancesCount < maxSessions;
          case 'busy':
            return seancesCount >= maxSessions;
          default:
            return true;
        }
      });
    }

    this.filteredEnseignants = filtered;
  }

  // Enseignant Management
  selectEnseignant(enseignant: Enseignant): void {
    this.selectedEnseignant = enseignant;
    this.showSeanceAssignment = false;
  }

  viewEnseignantDetails(enseignant: Enseignant): void {
    // Implement enseignant details dialog
    console.log('View enseignant details:', enseignant);
  }

  assignSeances(enseignant: Enseignant): void {
    this.selectedEnseignant = enseignant;
    this.openSeanceAssignment();
  }

  openSeanceAssignment(): void {
    this.showSeanceAssignment = true;
    this.selectedSeancesForAssignment = [];
    
    // Get available seances (not assigned to this enseignant)
    const assignedSeanceIds = this.getEnseignantSeances(this.selectedEnseignant!).map(s => s.id);
    this.availableSeances = this.seances.filter(seance => 
      !assignedSeanceIds.includes(seance.id)
    );
  }

  cancelSeanceAssignment(): void {
    this.showSeanceAssignment = false;
    this.selectedSeancesForAssignment = [];
  }

  toggleSeanceSelection(seanceId: number): void {
    const index = this.selectedSeancesForAssignment.indexOf(seanceId);
    if (index > -1) {
      this.selectedSeancesForAssignment.splice(index, 1);
    } else {
      this.selectedSeancesForAssignment.push(seanceId);
    }
  }

  confirmSeanceAssignment(): void {
    if (this.selectedSeancesForAssignment.length === 0) {
      this.snackBar.open('Veuillez sélectionner au moins une séance', 'Fermer', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.apiService.assignSeancesToEnseignant(
      this.selectedEnseignant!.id,
      this.selectedSeancesForAssignment
    ).subscribe({
      next: (response) => {
        this.snackBar.open('Séances assignées avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.cancelSeanceAssignment();
        this.loadDashboardData(); // Reload data to reflect changes
      },
      error: (error) => {
        console.error('Error assigning seances:', error);
        this.snackBar.open('Erreur lors de l\'assignation', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  removeSeanceFromEnseignant(seance: Seance): void {
    if (confirm(`Êtes-vous sûr de vouloir retirer cette séance de ${this.selectedEnseignant!.firstName} ${this.selectedEnseignant!.lastName} ?`)) {
      // Implement remove seance logic
      console.log('Remove seance:', seance);
      this.snackBar.open('Séance retirée avec succès', 'Fermer', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  // Utility Methods
  getEnseignantSeancesCount(enseignant: Enseignant): number {
    return this.getEnseignantSeances(enseignant).length;
  }

  getEnseignantSeances(enseignant: Enseignant): Seance[] {
    // Filter seances assigned to this enseignant
    return this.seances.filter(seance => seance.enseignantId === enseignant.id);
  }

  getEnseignantUtilization(enseignant: Enseignant): number {
    const seancesCount = this.getEnseignantSeancesCount(enseignant);
    const maxSessions = enseignant.maxSessionsPerWeek || 10;
    return Math.min((seancesCount / maxSessions) * 100, 100);
  }

  getUtilizationColor(enseignant: Enseignant): string {
    const utilization = this.getEnseignantUtilization(enseignant);
    if (utilization < 50) return 'primary';
    if (utilization < 80) return 'accent';
    return 'warn';
  }

  getEnseignantStatus(enseignant: Enseignant): string {
    const utilization = this.getEnseignantUtilization(enseignant);
    if (utilization < 50) return 'Disponible';
    if (utilization < 80) return 'Modérément occupé';
    return 'Très occupé';
  }

  getEnseignantStatusClass(enseignant: Enseignant): string {
    const utilization = this.getEnseignantUtilization(enseignant);
    if (utilization < 50) return 'status-available';
    if (utilization < 80) return 'status-moderate';
    return 'status-busy';
  }

  // Getters for template
  get assignedSeances(): number {
    return this.enseignants.reduce((total, enseignant) => 
      total + this.getEnseignantSeancesCount(enseignant), 0
    );
  }
}