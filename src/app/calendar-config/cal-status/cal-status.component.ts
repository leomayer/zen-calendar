import { Component, inject } from '@angular/core';
import { CalendarStore } from '@app/app-store.service';

@Component({
  selector: 'app-cal-status',
  templateUrl: './cal-status.component.html',
  styleUrl: './cal-status.component.scss',
})
export class CalStatusComponent {
  readonly calendarStore = inject(CalendarStore);
}
