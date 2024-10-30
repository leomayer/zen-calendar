import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

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
  readonly loacle = inject(LOCALE_ID);
  readonly dateFormatter = new Intl.DateTimeFormat(this.locale, {
    dateStyle: 'medium',
  });

  override getFirstDayOfWeek(): number {
    return 1;
  }

  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return this.dateFormatter.format(date);
    } else {
      return date.toDateString();
    }
  }
}
