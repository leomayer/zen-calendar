import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker';
import { AppStoreService } from 'src/app/app-store.service';
import { CalMonthHeaderComponent } from './cal-month-header/cal-month-header.component';
import { CalenderEvent } from '@app/helpers/calenderTypes';
import { CalenderService } from '@app/helpers/calender.service';

const isToday = (checkDate: Date) => {
  return areDatesOnSameDay(new Date(), checkDate);
};
function areDatesOnSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
@Component({
  selector: 'app-cal-basic',
  templateUrl: './cal-basic.component.html',
  styleUrls: ['./cal-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalBasicComponent implements OnInit {
  selectedDate!: Date | null;
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

  listOfEvents!: CalenderEvent[] | undefined;
  // for the header component
  monthHeader = CalMonthHeaderComponent;
  constructor(
    private store: AppStoreService,
    private calService: CalenderService,
  ) {}
  async ngOnInit(): Promise<void> {
    console.log('init done2');
    this.listOfEvents = await this.calService.getEvents(new Date());
    this.calendar.updateTodaysDate();
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    let retClass = '';
    // Only highligh dates inside the month view.
    if (view === 'month') {
      if (cellDate.getDay() === 0) {
        retClass += ' date-sunday';
      }
      // Highlight today.
      if (isToday(cellDate)) {
        retClass += ' highlight-date';
      }
      const events = this.getEvents(cellDate);
      if (events.length > 0) {
        retClass += ' date-bottom';
        if (events.length === 1) {
          retClass += ' date-one-entry';
        } else {
          retClass += ' date-two-entries';
        }
      }
      /*
      
      if (date === 14) {
        retClass += ' date-two-entries';
      } else if (date === 10) {
        retClass += ' date-bottom';
      } else if (date === 13) {
        retClass += ' date-bottom';
      }
      */
    }

    return retClass.trim();
  };

  displayDayEvents(selDate: Date | null) {
    if (selDate) {
      console.log(this.getEvents(selDate));
    }

    this.store.state.dateSelected.set(selDate);
  }

  private getEvents(filterDate: Date): CalenderEvent[] {
    return (
      this.listOfEvents?.filter((chk) =>
        areDatesOnSameDay(filterDate, chk.start.date),
      ) ?? []
    );
  }
}
