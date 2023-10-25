import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { CalBasicComponent } from './cal-basic/cal-basic.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
