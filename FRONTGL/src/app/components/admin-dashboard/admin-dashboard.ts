import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ModernDashboardComponent } from '../modern-dashboard/modern-dashboard';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/api-response.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ModernDashboardComponent
  ],
  template: `
    <div class="admin-dashboard-wrapper">
      <div class="admin-header">
        <h1>
          <mat-icon>admin_panel_settings</mat-icon>
          Administration Dashboard
        </h1>
        <p>Interface moderne de gestion des enseignants et séances</p>
      </div>
      <app-modern-dashboard></app-modern-dashboard>
    </div>
  `,
  styles: [`
    .admin-dashboard-wrapper {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .admin-header {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: white;
      padding: 2rem 0;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        mat-icon {
          font-size: 2.5rem;
          width: 2.5rem;
          height: 2.5rem;
        }
      }

      p {
        font-size: 1.1rem;
        opacity: 0.9;
        margin: 0;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // User data
  currentUser: User | null = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}