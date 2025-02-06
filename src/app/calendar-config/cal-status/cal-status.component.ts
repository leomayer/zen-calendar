import { Component, inject } from '@angular/core';
import { CalendarStore } from '@app/app-store.service';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-cal-status',
    templateUrl: './cal-status.component.html',
    styleUrl: './cal-status.component.scss',
    imports: [MatIcon, NgClass]
})
export class CalStatusComponent {
  readonly calendarStore = inject(CalendarStore);
}
