import { Component } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

@Component({
	selector: 'app-cal-basic',
	templateUrl: './cal-basic.component.html',
	styleUrls: ['./cal-basic.component.scss'],
	
})
export class CalBasicComponent {
	selectedDate!: Date | null;
	
	 dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? 'example-custom-date-class' : '';
    }

    return '';
  };
}
