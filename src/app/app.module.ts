import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { WeekdayDateService } from './helpers/weekday-date.service';
import { CalBasicComponent } from './calender-container/cal-basic/cal-basic.component';
import { CalShortCodeComponent } from './calender-container/cal-short-code/cal-short-code.component';

@NgModule({
  declarations: [AppComponent, CalBasicComponent, CalShortCodeComponent],
  imports: [MaterialDesignModule, BrowserModule, AppRoutingModule],
  providers: [
    { provide: DateAdapter, useClass: WeekdayDateService },
    { provide: MAT_DATE_LOCALE, useValue: 'de-AT' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
