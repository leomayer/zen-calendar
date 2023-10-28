import { Component } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { AppStoreService } from 'src/app/app-store.service';
import { MonthHeader } from './cal-month-header.component';

const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

@Component({
  selector: 'app-cal-basic',
  templateUrl: './cal-basic.component.html',
  styleUrls: ['./cal-basic.component.scss'],
})
export class CalBasicComponent {
  selectedDate!: Date | null;
  monthHeader = MonthHeader;

  constructor(private store: AppStoreService) {}

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    let retClass = '';
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();
      if (cellDate.getDay() === 0) {
        retClass += ' date-sunday';
      }
      if (date === 14) {
        retClass += ' date-bottom';
        retClass += ' date-two-entries';
      } else if (date === 10) {
        retClass += ' date-bottom';
        retClass += ' date-one-entry';
      } else if (date === 13) {
        retClass += ' date-bottom';
        retClass += ' date-two-entries';
      }
      // Highlight today.
      if (isToday(cellDate)) {
        retClass += ' highlight-date-class';
      }
    }

    return retClass.trim();
  };

  changeDate(selDate: Date | null) {
    this.store.state.dateSelected.set(selDate);
  }
}
