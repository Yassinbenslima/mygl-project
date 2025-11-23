import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CalendarService, CalendarEvent, CalendarView } from '../../services/calendar.service';
import { ApiService } from '../../services/api.service';
import { Session, SessionStatus } from '../../models/session.model';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule
  ],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendarContainer', { static: true }) calendarContainer!: ElementRef;

  private destroy$ = new Subject<void>();
  private calendar!: Calendar;

  // Observable data
  sessions$!: Observable<Session[]>;
  selectedSessions$!: Observable<Session[]>;
  currentDate$!: Observable<Date>;
  currentView$!: Observable<CalendarView>;
  isLoading = false;

  // Calendar state
  availableViews: CalendarView[] = [];
  selectedDate = new Date();
  currentView: CalendarView = this.availableViews[0];

  // Filter options
  statusFilter = '';
  departmentFilter = '';
  gradeFilter = '';

  // Statistics
  totalSessions = 0;
  availableSessions = 0;
  selectedSessionsCount = 0;
  sessionCountsByDate: Map<string, number> = new Map();

  constructor(
    private calendarService: CalendarService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.availableViews = this.calendarService.calendarViews;
    this.currentView = this.availableViews[0];
    this.initializeObservables();
    this.loadSessions();
    this.subscribeToChanges();
  }

  ngAfterViewInit(): void {
    this.initializeCalendar();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.calendar) {
      this.calendar.destroy();
    }
  }

  private initializeObservables(): void {
    this.sessions$ = this.calendarService.getSessionsForCurrentView();
    this.selectedSessions$ = this.calendarService.selectedSessions$;
    this.currentDate$ = this.calendarService.currentDate$;
    this.currentView$ = this.calendarService.currentView$;
  }

  private subscribeToChanges(): void {
    // Subscribe to date changes
    this.currentDate$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(date => {
      this.selectedDate = date;
      this.loadSessions();
    });

    // Subscribe to view changes
    this.currentView$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(view => {
      this.currentView = view;
      if (this.calendar) {
        this.calendar.changeView(view.type);
      }
    });

    // Subscribe to selected sessions
    this.selectedSessions$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(sessions => {
      this.selectedSessionsCount = sessions.length;
      this.updateCalendarEvents();
    });
  }

  private initializeCalendar(): void {
    const calendarOptions: CalendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: this.currentView.type,
      headerToolbar: false, // We'll use custom toolbar
      height: 'auto',
      aspectRatio: 1.8,
      locale: 'fr',
      firstDay: 1, // Monday
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: 3,
      moreLinkClick: 'popover',
      eventDisplay: 'block',
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      slotMinTime: '07:00:00',
      slotMaxTime: '20:00:00',
      slotDuration: '01:00:00',
      eventClick: this.onEventClick.bind(this),
      dateClick: this.onDateClick.bind(this),
      eventDrop: this.onEventDrop.bind(this),
      eventResize: this.onEventResize.bind(this),
      select: this.onDateSelect.bind(this),
      eventDidMount: this.onEventMount.bind(this),
      eventWillUnmount: this.onEventUnmount.bind(this),
      dayCellDidMount: this.onDayCellMount.bind(this)
    };

    this.calendar = new Calendar(this.calendarContainer.nativeElement, calendarOptions);
    this.calendar.render();
  }
  
  private onDayCellMount(info: any): void {
    const dateStr = info.date.toDateString();
    const count = this.sessionCountsByDate.get(dateStr) || 0;
    
    if (count > 0) {
      // Add session count badge to the day cell
      const badge = document.createElement('div');
      badge.className = 'session-count-badge';
      badge.textContent = `${count}`;
      badge.setAttribute('data-count', count.toString());
      
      // Insert badge into the date cell
      const dayNumberEl = info.el.querySelector('.fc-daygrid-day-number');
      if (dayNumberEl) {
        // Add a wrapper to position the badge
        const wrapper = document.createElement('div');
        wrapper.className = 'day-number-wrapper';
        wrapper.innerHTML = dayNumberEl.innerHTML;
        wrapper.appendChild(badge);
        dayNumberEl.parentNode?.replaceChild(wrapper, dayNumberEl);
      }
      
      // Add visual indicator class based on count
      if (count === 1) {
        info.el.classList.add('has-sessions', 'single-session');
      } else if (count <= 3) {
        info.el.classList.add('has-sessions', 'few-sessions');
      } else {
        info.el.classList.add('has-sessions', 'many-sessions');
      }
      
      // Highlight today
      const today = new Date();
      if (info.date.toDateString() === today.toDateString()) {
        info.el.classList.add('fc-day-today');
      }
    }
  }

  private async loadSessions(): Promise<void> {
    this.isLoading = true;
    try {
      const filter = this.buildFilter();
      const sessions = await this.apiService.getSessions(filter).toPromise();
      
      this.totalSessions = sessions?.length || 0;
      this.availableSessions = sessions?.filter(s => s.status === SessionStatus.AVAILABLE).length || 0;
      
      // Build session counts map
      this.buildSessionCounts(sessions || []);
      
      this.updateCalendarEvents(sessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      this.snackBar.open('Erreur lors du chargement des séances', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isLoading = false;
    }
  }
  
  private buildSessionCounts(sessions: Session[]): void {
    const counts = new Map<string, number>();
    
    sessions.forEach(session => {
      const dateStr = new Date(session.date).toDateString();
      const currentCount = counts.get(dateStr) || 0;
      counts.set(dateStr, currentCount + 1);
    });
    
    this.sessionCountsByDate = counts;
  }

  private buildFilter(): any {
    return {
      startDate: this.getViewStartDate(),
      endDate: this.getViewEndDate(),
      status: this.statusFilter || undefined,
      department: this.departmentFilter || undefined,
      gradeId: this.gradeFilter || undefined,
      availableOnly: false
    };
  }

  private getViewStartDate(): Date {
    const date = new Date(this.selectedDate);
    switch (this.currentView.type) {
      case 'dayGridMonth':
        date.setDate(1);
        break;
      case 'timeGridWeek':
      case 'listWeek':
        date.setDate(date.getDate() - date.getDay());
        break;
      case 'timeGridDay':
        break;
    }
    return date;
  }

  private getViewEndDate(): Date {
    const date = new Date(this.selectedDate);
    switch (this.currentView.type) {
      case 'dayGridMonth':
        date.setMonth(date.getMonth() + 1, 0);
        break;
      case 'timeGridWeek':
      case 'listWeek':
        date.setDate(date.getDate() + (6 - date.getDay()));
        break;
      case 'timeGridDay':
        date.setDate(date.getDate() + 1);
        break;
    }
    return date;
  }

  private updateCalendarEvents(sessions?: Session[]): void {
    if (!this.calendar) return;

    let eventsToShow: Session[] = sessions || [];
    
    // If no sessions provided, get current calendar events
    if (!sessions) {
      const currentEvents = this.calendar.getEvents();
      eventsToShow = currentEvents.map(event => event.extendedProps['session']);
    }

    const calendarEvents = this.calendarService.sessionsToEvents(eventsToShow);
    this.calendar.removeAllEvents();
    this.calendar.addEventSource(calendarEvents);
  }

  // Event handlers
  onEventClick(info: any): void {
    const session: Session = info.event.extendedProps.session;
    this.toggleSessionSelection(session);
  }

  onDateClick(info: any): void {
    this.calendarService.setCurrentDate(info.date);
  }

  onEventDrop(info: any): void {
    // Handle event drop (if admin)
    console.log('Event dropped:', info);
  }

  onEventResize(info: any): void {
    // Handle event resize (if admin)
    console.log('Event resized:', info);
  }

  onDateSelect(info: any): void {
    // Handle date range selection
    console.log('Date range selected:', info);
  }

  onEventMount(info: any): void {
    // Add custom styling or behavior when event mounts
    const session: Session = info.event.extendedProps.session;
    const element = info.el;
    
    if (this.calendarService.isSessionSelected(session)) {
      element.classList.add('selected-session');
    }
    
    // Add tooltip
    element.setAttribute('title', this.calendarService.getSessionTooltip(session));
  }

  onEventUnmount(info: any): void {
    // Cleanup when event unmounts
  }

  // UI Actions
  toggleSessionSelection(session: Session): void {
    if (session.status === SessionStatus.FULL || !session.available) {
      this.snackBar.open('Cette séance n\'est pas disponible', 'Fermer', {
        duration: 2000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.calendarService.toggleSessionSelection(session);
    
    const message = this.calendarService.isSessionSelected(session) 
      ? 'Séance sélectionnée' 
      : 'Séance désélectionnée';
    
    this.snackBar.open(message, 'Fermer', {
      duration: 1500,
      panelClass: ['success-snackbar']
    });
  }

  clearSelection(): void {
    this.calendarService.clearSelection();
    this.snackBar.open('Sélection effacée', 'Fermer', {
      duration: 1500
    });
  }

  navigateDate(direction: 'prev' | 'next'): void {
    this.calendarService.navigateDate(direction, this.currentView.type);
  }

  changeView(view: CalendarView): void {
    this.calendarService.setView(view);
  }

  goToToday(): void {
    this.calendarService.setCurrentDate(new Date());
  }

  applyFilters(): void {
    this.loadSessions();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.departmentFilter = '';
    this.gradeFilter = '';
    this.applyFilters();
  }

  // Getters for template
  get isPrevDisabled(): boolean {
    return this.isLoading;
  }

  get isNextDisabled(): boolean {
    return this.isLoading;
  }

  get currentDateFormatted(): string {
    return this.selectedDate.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  }

  get selectedSessions(): Session[] {
    return this.calendarService['selectedSessionsSubject'].value;
  }
}