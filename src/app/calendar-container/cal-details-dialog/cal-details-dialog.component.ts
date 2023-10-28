import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEventUI } from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-cal-details-dialog',
  templateUrl: './cal-details-dialog.component.html',
  styleUrls: ['./cal-details-dialog.component.scss'],
})
export class CalDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) protected data: CalendarEventUI) {}
}
