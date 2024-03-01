import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  LOCALE_ID,
  OnDestroy,
  inject,
} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppStoreService, CalendarStore } from '@app/app-store.service';

@Component({
  selector: 'app-cal-month-header',
  templateUrl: './cal-month-header.component.html',
  styleUrls: ['./cal-month-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalMonthHeaderComponent<D> implements OnDestroy {
  private _destroyed = new Subject<void>();
  readonly calendarStore = inject(CalendarStore);

  constructor(
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(LOCALE_ID) private localeId: string,
    cdr: ChangeDetectorRef,
    private store: AppStoreService,
  ) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this.formatHeader(this._calendar.activeDate as Date, this.localeId);
  }

  previousClicked() {
    const nextMonth = this._dateAdapter.addCalendarMonths(
      this._calendar.activeDate,
      -1,
    );
    this._calendar.activeDate = nextMonth;
    this.store.state.monthChanged.next(nextMonth as Date);
  }

  nextClicked() {
    const prevMonth = this._dateAdapter.addCalendarMonths(
      this._calendar.activeDate,
      1,
    );
    this._calendar.activeDate = prevMonth;
    this.store.state.monthChanged.next(prevMonth as Date);
  }

  formatHeader(date: Date, locale = 'en-US') {
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
    });
    return formatter.format(date);
  }
}
