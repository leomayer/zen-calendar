import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppStoreService } from '@app/app-store.service';

@Component({
  selector: 'app-cal-month-header',
  templateUrl: './cal-month-header.component.html',
  styleUrls: ['./cal-month-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalMonthHeaderComponent<D> implements OnDestroy {
  private _destroyed = new Subject<void>();
  constructor(
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
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
    return this._dateAdapter
      .format(
        this._calendar.activeDate,
        this._dateFormats.display.monthYearLabel,
      )
      .toLocaleUpperCase();
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
}
