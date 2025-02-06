import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  CUSTOM_DATE_FORMATS,
  WeekdayDateService,
} from './helpers/weekday-date.service';
import { GlobalErrorHandler } from './helpers/GlobalErrorHandler';
import { CalBasicComponent } from '@calendar/cal-basic/cal-basic.component';
import { CalShortCodeComponent } from '@calendar/cal-short-code/cal-short-code.component';
import { CalConfigComponent } from '@calConfig/cal-config/cal-config.component';
import { CalMonthHeaderComponent } from './calendar-container/cal-basic/cal-month-header/cal-month-header.component';
import { CalDetailsDialogComponent } from './calendar-container/cal-details-dialog/cal-details-dialog.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TimeFormatterComponent } from './calendar-container/time-formatter/time-formatter.component';
import { Minutes2HourMinPipe } from './helpers/minutes2-hour-min.pipe';
import { LinkDetailsComponent } from '@calendar/link-details/link-details.component';
import { CalButtonDetailsComponent } from './cal-button-details/cal-button-details.component';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';

import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';
import { CalTimeConfigComponent } from './calendar-config/cal-time-config/cal-time-config.component';
import { CalStatusComponent } from '@calConfig/cal-status/cal-status.component';
import { CdkColumnDef } from '@angular/cdk/table';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
/*
import {
	MAT_LUXON_DATE_ADAPTER_OPTIONS,
  provideLuxonDateAdapter,
} from '@angular/material-luxon-adapter';
*/

registerLocaleData(localeDe);
registerLocaleData(localeEn);

@NgModule({
  declarations: [AppComponent],
  providers: [
    { provide: DateAdapter, useClass: WeekdayDateService },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'accent' },
    },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    provideHttpClient(withInterceptorsFromDi()),
    /*
        {provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true, firstDayOfWeek: 1}},
        provideLuxonDateAdapter(),
        */
    CdkColumnDef,
    // datepicker als UTC
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
  bootstrap: [AppComponent],
  imports: [
    MaterialDesignModule,
    BrowserModule,
    CalTimeConfigComponent,
    CalBasicComponent,
    CalShortCodeComponent,
    CalConfigComponent,
    CalMonthHeaderComponent,
    CalDetailsDialogComponent,
    TimeFormatterComponent,
    Minutes2HourMinPipe,
    LinkDetailsComponent,
    CalButtonDetailsComponent,
    CalStatusComponent,
  ],
})
export class AppModule {}
