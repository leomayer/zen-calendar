import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import * as moment from 'moment';

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@Injectable({
  providedIn: 'root',
})
export class WeekdayDateService extends NativeDateAdapter {
  readonly dateFormat = 'YYYY-MM-DD';

  override getFirstDayOfWeek(): number {
    return 1;
  }

  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return moment(date).format(this.dateFormat);
    } else {
      return date.toDateString();
    }
  }
}
