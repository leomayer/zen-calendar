import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { CalBasicComponent } from './cal-basic/cal-basic.component';
import { DateAdapter } from '@angular/material/core';
import { WeekdayDateService } from './helpers/weekday-date.service';

@NgModule({
  declarations: [
    AppComponent,
    CalBasicComponent
  ],
  imports: [
		MaterialDesignModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{provide: DateAdapter, useClass: WeekdayDateService} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
