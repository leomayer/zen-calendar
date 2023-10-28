import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { DateAdapter } from '@angular/material/core';
import { WeekdayDateService } from './helpers/weekday-date.service';
import { GlobalErrorHandler } from './helpers/GlobalErrorHandler';
import { CalBasicComponent } from '@calendar/cal-basic/cal-basic.component';
import { CalShortCodeComponent } from '@calendar/cal-short-code/cal-short-code.component';
import { CalConfigComponent } from '@calConfig/cal-config/cal-config.component';
import { CalMonthHeaderComponent } from './calendar-container/cal-basic/cal-month-header/cal-month-header.component';

@NgModule({
  declarations: [
    AppComponent,
    CalBasicComponent,
    CalShortCodeComponent,
    CalConfigComponent,
    CalMonthHeaderComponent,
  ],
  imports: [MaterialDesignModule, BrowserModule, AppRoutingModule],
  providers: [
    { provide: DateAdapter, useClass: WeekdayDateService },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
