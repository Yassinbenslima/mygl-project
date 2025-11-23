import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Session, SessionStatus, Teacher } from '../models/session.model';
import { ApiService } from './api.service';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    session: Session;
    status: SessionStatus;
    supervisorsCount: number;
    requiredSupervisors: number;
    available: boolean;
    location: string;
    grade: string;
  };
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  classNames: string[];
}

export interface CalendarView {
  type: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  title: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private currentDateSubject = new BehaviorSubject<Date>(new Date());
  private selectedSessionsSubject = new BehaviorSubject<Session[]>([]);
  private viewSubject = new BehaviorSubject<CalendarView>({
    type: 'dayGridMonth',
    title: 'Month',
    icon: 'view_module'
  });
  private filterSubject = new BehaviorSubject<any>({});

  public currentDate$ = this.currentDateSubject.asObservable();
  public selectedSessions$ = this.selectedSessionsSubject.asObservable();
  public currentView$ = this.viewSubject.asObservable();
  public filter$ = this.filterSubject.asObservable();

  // Available calendar views
  public readonly calendarViews: CalendarView[] = [
    { type: 'dayGridMonth', title: 'Month', icon: 'view_module' },
    { type: 'timeGridWeek', title: 'Week', icon: 'view_week' },
    { type: 'timeGridDay', title: 'Day', icon: 'view_day' },
    { type: 'listWeek', title: 'List', icon: 'view_list' }
  ];

  constructor(private apiService: ApiService) {}

  // Date navigation
  setCurrentDate(date: Date): void {
    this.currentDateSubject.next(date);
  }

  getCurrentDate(): Date {
    return this.currentDateSubject.value;
  }

  navigateDate(direction: 'prev' | 'next', viewType: string): void {
    const currentDate = this.getCurrentDate();
    let newDate = new Date(currentDate);

    switch (viewType) {
      case 'dayGridMonth':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'timeGridWeek':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'timeGridDay':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      default:
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }

    this.setCurrentDate(newDate);
  }

  // View management
  setView(view: CalendarView): void {
    this.viewSubject.next(view);
  }

  getCurrentView(): CalendarView {
    return this.viewSubject.value;
  }

  // Session selection for preferences
  selectSession(session: Session): void {
    const currentSelected = this.selectedSessionsSubject.value;
    
    if (!this.isSessionSelected(session)) {
      const updatedSelected = [...currentSelected, session];
      this.selectedSessionsSubject.next(updatedSelected);
    }
  }

  deselectSession(session: Session): void {
    const currentSelected = this.selectedSessionsSubject.value;
    const updatedSelected = currentSelected.filter(s => s.id !== session.id);
    this.selectedSessionsSubject.next(updatedSelected);
  }

  toggleSessionSelection(session: Session): void {
    if (this.isSessionSelected(session)) {
      this.deselectSession(session);
    } else {
      this.selectSession(session);
    }
  }

  clearSelection(): void {
    this.selectedSessionsSubject.next([]);
  }

  isSessionSelected(session: Session): boolean {
    return this.selectedSessionsSubject.value.some(s => s.id === session.id);
  }

  // Filters
  setFilter(filter: any): void {
    this.filterSubject.next(filter);
  }

  getCurrentFilter(): any {
    return this.filterSubject.value;
  }

  // Convert sessions to calendar events
  sessionsToEvents(sessions: Session[]): CalendarEvent[] {
    return sessions.map(session => this.sessionToEvent(session));
  }

  private sessionToEvent(session: Session): CalendarEvent {
    const startDateTime = this.combineDateTime(session.date, session.startTime);
    const endDateTime = this.combineDateTime(session.date, session.endTime);
    
    const colors = this.getSessionColors(session);
    
    return {
      id: session.id.toString(),
      title: this.getSessionTitle(session),
      start: startDateTime,
      end: endDateTime,
      extendedProps: {
        session,
        status: session.status,
        supervisorsCount: session.currentSupervisors,
        requiredSupervisors: session.requiredSupervisors,
        available: session.available,
        location: session.location,
        grade: session.grade.name
      },
      ...colors,
      classNames: this.getSessionClasses(session)
    };
  }

  private combineDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  }

  private getSessionTitle(session: Session): string {
    const supervisorsInfo = `${session.currentSupervisors}/${session.requiredSupervisors}`;
    return `${session.subject} - ${session.grade.name} (${supervisorsInfo})`;
  }

  private getSessionColors(session: Session): any {
    const isSelected = this.isSessionSelected(session);
    
    if (isSelected) {
      return {
        backgroundColor: '#1976d2',
        borderColor: '#1565c0',
        textColor: '#ffffff'
      };
    }

    switch (session.status) {
      case SessionStatus.AVAILABLE:
        return {
          backgroundColor: '#4caf50',
          borderColor: '#388e3c',
          textColor: '#ffffff'
        };
      case SessionStatus.SATURATED:
        return {
          backgroundColor: '#ff9800',
          borderColor: '#f57c00',
          textColor: '#ffffff'
        };
      case SessionStatus.FULL:
        return {
          backgroundColor: '#f44336',
          borderColor: '#d32f2f',
          textColor: '#ffffff'
        };
      case SessionStatus.CANCELLED:
        return {
          backgroundColor: '#9e9e9e',
          borderColor: '#616161',
          textColor: '#ffffff'
        };
      default:
        return {
          backgroundColor: '#2196f3',
          borderColor: '#1976d2',
          textColor: '#ffffff'
        };
    }
  }

  private getSessionClasses(session: Session): string[] {
    const classes = ['session-event'];
    
    if (this.isSessionSelected(session)) {
      classes.push('selected');
    }
    
    classes.push(session.status.toLowerCase());
    
    if (!session.available) {
      classes.push('unavailable');
    }
    
    if (session.currentSupervisors >= session.requiredSupervisors) {
      classes.push('saturated');
    }
    
    return classes;
  }

  // Utility methods
  getSessionTooltip(session: Session): string {
    return `
      <div class="session-tooltip">
        <h4>${session.subject}</h4>
        <p><strong>Grade:</strong> ${session.grade.name}</p>
        <p><strong>Time:</strong> ${session.startTime} - ${session.endTime}</p>
        <p><strong>Location:</strong> ${session.location}</p>
        <p><strong>Supervisors:</strong> ${session.currentSupervisors}/${session.requiredSupervisors}</p>
        <p><strong>Status:</strong> ${session.status}</p>
      </div>
    `;
  }

  // Get sessions for current view
  getSessionsForCurrentView(): Observable<any> {
    return combineLatest([
      this.currentDate$,
      this.currentView$,
      this.filter$
    ]).pipe(
      map(([date, view, filter]) => {
        const startDate = new Date(date);
        const endDate = new Date(date);

        switch (view.type) {
          case 'dayGridMonth':
            startDate.setDate(1);
            endDate.setMonth(endDate.getMonth() + 1, 0);
            break;
          case 'timeGridWeek':
            startDate.setDate(date.getDate() - date.getDay());
            endDate.setDate(startDate.getDate() + 6);
            break;
          case 'timeGridDay':
            endDate.setDate(date.getDate() + 1);
            break;
          default:
            startDate.setDate(date.getDate() - date.getDay());
            endDate.setDate(startDate.getDate() + 6);
        }

        return { startDate, endDate, filter };
      })
    );
  }
}
