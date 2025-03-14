import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker';
import { CalMonthHeaderComponent } from './cal-month-header/cal-month-header.component';
import { CalendarEventShort } from '@app/helpers/calenderTypes';
import { CalenderService } from '@app/helpers/calender.service';
import { AppStoreService, CalendarStore } from '@app/app-store.service';
import { areDatesOnSameDay } from '@app/helpers/calendar.functions.helper';
import { MatDialog } from '@angular/material/dialog';
import { CalSaveConfigComponent } from '@calConfig/cal-save-config/cal-save-config.component';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-cal-basic',
    templateUrl: './cal-basic.component.html',
    styleUrls: ['./cal-basic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCalendar]
})
export class CalBasicComponent implements OnInit {
  selectedDate!: Date | null;
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  readonly calendarStore = inject(CalendarStore);

  listOfEvents!: CalendarEventShort[] | undefined;
  // for the header component
  monthHeader = CalMonthHeaderComponent;

  constructor(
    private calService: CalenderService,
    private store: AppStoreService,
    private dialog: MatDialog,
  ) {}
  async ngOnInit(): Promise<void> {
    await this.updateEvents(new Date());
    this.store.state.monthChanged.subscribe((month) =>
      this.updateEvents(month),
    );
  }

  async updateEvents(date4Calendar: Date) {
    this.calendarStore.setSelectedMonth(date4Calendar);
    this.listOfEvents = await this.calService.getEvents(date4Calendar);
    this.calendar.updateTodaysDate();
    this.calendarStore.patchDate(null);
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    let retClass = 'clbtn ';
    // Only highligh dates inside the month view.
    if (view === 'month') {
      if (cellDate.getDay() === 0) {
        retClass += ' date-sunday';
      }
      // Highlight today.
      if (this.calendarStore.isSelectedDate(cellDate)) {
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

    if (
      retClass.includes('date-one-entry') &&
      retClass.includes('date-two-entries')
    ) {
      retClass = retClass.replace('date-one-entry', '');
    }

    return retClass.trim();
  };

  changedView(event: unknown) {
    console.log('changed view', event);
  }

  async displayDayEvents(selDate: Date | null) {
    if (this.calendarStore.hasConfigChanges()) {
      await this.ask4Save();
    }
    this.calendarStore.patchDate(selDate);
    if (selDate && !this.calendarStore.isActive()) {
      const eventId =
        this.listOfEvents?.find((chk) =>
          areDatesOnSameDay(chk.start, selDate),
        ) ?? ({} as CalendarEventShort);

      // update the selected date
      if (this.calendarStore.useConfigInterface()) {
        this.calendar.updateTodaysDate();
      }
      // usage with SignalStore
      await this.calendarStore.loadDetails(eventId);
    }
  }
  async ask4Save(): Promise<void> {
    this.calendarStore.setVerifySave();
    const dialogRef = this.dialog.open(CalSaveConfigComponent, {
      width: '250px',
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
    });
    return await firstValueFrom(dialogRef.afterClosed()).then((result) => {
      this.calendarStore.setLoaded();
    });
  }

  private getEventCount(filterDate: Date): number {
    const chk = this.listOfEvents?.find((chk) =>
      areDatesOnSameDay(filterDate, chk.start),
    );
    if (chk) {
      if (chk.onlyEventId4Day) {
        return 1;
      }
      return chk.eventIds.length ?? 0;
    }
    return 0;
  }
}
