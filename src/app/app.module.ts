import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { DateAdapter } from '@angular/material/core';
import { WeekdayDateService } from './helpers/weekday-date.service';
import { GlobalErrorHandler } from './helpers/GlobalErrorHandler';
import { CalBasicComponent } from '@calendar/cal-basic/cal-basic.component';
import { CalShortCodeComponent } from '@calendar/cal-short-code/cal-short-code.component';
import { CalConfigComponent } from '@calConfig/cal-config/cal-config.component';
import { CalMonthHeaderComponent } from './calendar-container/cal-basic/cal-month-header/cal-month-header.component';
import { CalDetailsDialogComponent } from './calendar-container/cal-details-dialog/cal-details-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { TimeFormatterComponent } from './calendar-container/time-formatter/time-formatter.component';
import { Minutes2HourMinPipe } from './helpers/minutes2-hour-min.pipe';
import { LinkDetailsComponent } from '@calendar/link-details/link-details.component';
import { CalButtonDetailsComponent } from './cal-button-details/cal-button-details.component';

@NgModule({
  declarations: [
    AppComponent,
    CalBasicComponent,
    CalShortCodeComponent,
    CalConfigComponent,
    CalMonthHeaderComponent,
    CalDetailsDialogComponent,
    TimeFormatterComponent,
    Minutes2HourMinPipe,
    LinkDetailsComponent,
    CalButtonDetailsComponent,
  ],
  imports: [MaterialDesignModule, BrowserModule, HttpClientModule],
  providers: [
    { provide: DateAdapter, useClass: WeekdayDateService },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
