import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Enseignant, Seance } from '../interfaces/spring-boot-api.interface';

@Injectable({
  providedIn: 'root'
})
export class TestDataService {
  
  getTestEnseignants(): Enseignant[] {
    return [
      {
        id: 1,
        firstName: 'Ahmed',
        lastName: 'Ben Ali',
        email: 'ahmed.benali@univ-sfax.tn',
        department: 'Économie',
        maxSessionsPerWeek: 10,
        currentWeeklySessions: 3,
        role: 'Professeur'
      },
      {
        id: 2,
        firstName: 'Fatma',
        lastName: 'Khelil',
        email: 'fatma.khelil@univ-sfax.tn',
        department: 'Gestion',
        maxSessionsPerWeek: 8,
        currentWeeklySessions: 6,
        role: 'Maître de Conférence'
      },
      {
        id: 3,
        firstName: 'Mohamed',
        lastName: 'Trabelsi',
        email: 'mohamed.trabelsi@univ-sfax.tn',
        department: 'Économie',
        maxSessionsPerWeek: 12,
        currentWeeklySessions: 2,
        role: 'Professeur'
      },
      {
        id: 4,
        firstName: 'Salma',
        lastName: 'Hammami',
        email: 'salma.hammami@univ-sfax.tn',
        department: 'Gestion',
        maxSessionsPerWeek: 10,
        currentWeeklySessions: 8,
        role: 'Maître de Conférence'
      },
      {
        id: 5,
        firstName: 'Karim',
        lastName: 'Jebali',
        email: 'karim.jebali@univ-sfax.tn',
        department: 'Finance',
        maxSessionsPerWeek: 8,
        currentWeeklySessions: 1,
        role: 'Assistant'
      },
      {
        id: 6,
        firstName: 'Amina',
        lastName: 'Bouaziz',
        email: 'amina.bouaziz@univ-sfax.tn',
        department: 'Finance',
        maxSessionsPerWeek: 10,
        currentWeeklySessions: 7,
        role: 'Maître de Conférence'
      }
    ];
  }

  getTestSeances(): Seance[] {
    return [
      {
        id: 1,
        subject: 'Économie Générale',
        date: new Date('2024-01-15'),
        startTime: '09:00',
        endTime: '11:00',
        location: 'Salle A101',
        grade: { id: 1, name: 'L1 Eco', level: 'Licence', department: 'Économie' },
        enseignantId: 1,
        status: 'assigned'
      },
      {
        id: 2,
        subject: 'Comptabilité',
        date: new Date('2024-01-16'),
        startTime: '14:00',
        endTime: '16:00',
        location: 'Salle B205',
        grade: { id: 2, name: 'L2 Gestion', level: 'Licence', department: 'Gestion' },
        enseignantId: 2,
        status: 'assigned'
      },
      {
        id: 3,
        subject: 'Mathématiques Financières',
        date: new Date('2024-01-17'),
        startTime: '10:00',
        endTime: '12:00',
        location: 'Salle C301',
        grade: { id: 3, name: 'M1 Finance', level: 'Master', department: 'Finance' },
        status: 'available'
      },
      {
        id: 4,
        subject: 'Marketing',
        date: new Date('2024-01-18'),
        startTime: '08:00',
        endTime: '10:00',
        location: 'Salle D102',
        grade: { id: 4, name: 'L3 Gestion', level: 'Licence', department: 'Gestion' },
        status: 'available'
      },
      {
        id: 5,
        subject: 'Statistiques',
        date: new Date('2024-01-19'),
        startTime: '13:00',
        endTime: '15:00',
        location: 'Salle E201',
        grade: { id: 5, name: 'L2 Eco', level: 'Licence', department: 'Économie' },
        enseignantId: 3,
        status: 'assigned'
      },
      {
        id: 6,
        subject: 'Gestion de Projet',
        date: new Date('2024-01-20'),
        startTime: '11:00',
        endTime: '13:00',
        location: 'Salle F103',
        grade: { id: 6, name: 'M2 Gestion', level: 'Master', department: 'Gestion' },
        status: 'available'
      }
    ];
  }

  getEnseignants(): Observable<Enseignant[]> {
    return of(this.getTestEnseignants());
  }

  getSeances(): Observable<Seance[]> {
    return of(this.getTestSeances());
  }
}
