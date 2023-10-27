import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { DateAdapter } from '@angular/material/core';
import { WeekdayDateService } from './helpers/weekday-date.service';
import { CalBasicComponent } from './calender-container/cal-basic/cal-basic.component';
import { CalShortCodeComponent } from './calender-container/cal-short-code/cal-short-code.component';
import { CalConfigComponent } from './calender-config/cal-config/cal-config.component';
import { GlobalErrorHandler } from './helpers/GlobalErrorHandler';

@NgModule({
  declarations: [
    AppComponent,
    CalBasicComponent,
    CalShortCodeComponent,
    CalConfigComponent,
  ],
  imports: [MaterialDesignModule, BrowserModule, AppRoutingModule],
  providers: [
    { provide: DateAdapter, useClass: WeekdayDateService },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
