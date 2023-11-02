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
import { CalMonthHeaderComponent } from './cal-month-header/cal-month-header.component';
import { CalendarEvent, CalendarEventShort } from '@app/helpers/calenderTypes';
import { CalenderService } from '@app/helpers/calender.service';
import { MatDialog } from '@angular/material/dialog';
import { CalDetailsDialogComponent } from '@calendar/cal-details-dialog/cal-details-dialog.component';
import { AppStoreService } from '@app/app-store.service';
import {
  areDatesOnSameDay,
  isToday,
} from '@app/helpers/calendar.functions.helper';

@Component({
  selector: 'app-cal-basic',
  templateUrl: './cal-basic.component.html',
  styleUrls: ['./cal-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalBasicComponent implements OnInit {
  selectedDate!: Date | null;
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

  listOfEvents!: CalendarEventShort[] | undefined;
  // for the header component
  monthHeader = CalMonthHeaderComponent;

  constructor(
    private calService: CalenderService,
    private dialog: MatDialog,
    private store: AppStoreService,
  ) {}
  async ngOnInit(): Promise<void> {
    await this.updateEvents(new Date());
    this.store.state.monthChanged.subscribe((month) =>
      this.updateEvents(month),
    );
  }

  async updateEvents(date4Calendar: Date) {
    this.listOfEvents = await this.calService.getEvents(date4Calendar);
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
      const cntEvents = this.getEventCount(cellDate);
      if (cntEvents > 0) {
        retClass += ' date-bottom';
        if (cntEvents === 1) {
          retClass += ' date-one-entry';
        } else {
          retClass += ' date-two-entries';
        }
      }
    }

    return retClass.trim();
  };

  changedView(event: unknown) {
    console.log('changed view', event);
  }

  displayDayEvents(selDate: Date | null) {
    if (selDate) {
      const events = [] as CalendarEvent[];
      //      const events = this.getEvents(selDate);
      if (events.length) {
        const data = {
          selDate,
          events,
        };
        this.dialog.open(CalDetailsDialogComponent, {
          data,
          width: '250px',
          backdropClass: 'cdk-overlay-transparent-backdrop',
          hasBackdrop: true,
          enterAnimationDuration: '500ms',
          exitAnimationDuration: '500ms',
        });
      }
    }
  }

  private getEventCount(filterDate: Date): number {
    const ret =
      this.listOfEvents?.find((chk) => areDatesOnSameDay(filterDate, chk.start))
        ?.eventIds.length ?? 0;
    return ret;
  }
}
