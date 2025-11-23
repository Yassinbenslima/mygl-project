import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/auth.guard';
import { TeacherGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Default route - redirect to login
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // Login route
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent),
    title: 'Connexion - Surveillance Management'
  },
  
  // Teacher Dashboard (protected)
  {
    path: 'dashboard',
    loadComponent: () => import('./components/teacher-dashboard/teacher-dashboard').then(m => m.TeacherDashboardComponent),
    canActivate: [TeacherGuard],
    title: 'Tableau de bord - Enseignant'
  },
  
  // Admin Dashboard (protected)
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
    canActivate: [AdminGuard],
    title: 'Administration - Surveillance Management'
  },
  
  // Calendar component (standalone access)
  {
    path: 'calendar',
    loadComponent: () => import('./components/calendar/calendar').then(m => m.CalendarComponent),
    canActivate: [AuthGuard],
    title: 'Calendrier - Surveillance Management'
  },
  
  // Wildcard route - redirect to login
  {
    path: '**',
    redirectTo: '/login'
  }
];