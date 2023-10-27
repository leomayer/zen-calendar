import { Component, ViewEncapsulation } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { AppStoreService } from 'src/app/app-store.service';

@Component({
  selector: 'app-cal-basic',
  templateUrl: './cal-basic.component.html',
  styleUrls: ['./cal-basic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalBasicComponent {
  selectedDate!: Date | null;

  constructor(private store: AppStoreService) {}

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    let retClass = '';
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();
      if (cellDate.getDay() === 0) {
        retClass += ' date-sunday';
      }
      if (date === 15) {
        retClass += ' date-bottom';
      }
      // Highlight the 1st and 20th day of each month.
      if (date === 1 || date === 20) {
        retClass += ' highlight-date-class';
      }
    }

    return retClass.trim();
  };

  changeDate(selDate: Date | null) {
    this.store.state.dateSelected.set(selDate);
  }
}
