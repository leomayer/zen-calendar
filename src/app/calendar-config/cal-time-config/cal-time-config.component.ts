import { JsonPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CalendarStore } from '@app/app-store.service';
import {
  CalConfigTimeDetail,
  CalenderTimeConfig,
  FrequTypeUI,
} from '@app/helpers/calenderTypes';
import { MaterialDesignModule } from '@app/material-design/material-design.module';
import { CalConfigDetailComponent } from '@calConfig/cal-config-detail/cal-config-detail.component';

@Component({
  selector: 'app-cal-time-config',
  standalone: true,
  imports: [JsonPipe, MaterialDesignModule, CalConfigDetailComponent],
  templateUrl: './cal-time-config.component.html',
  styleUrl: './cal-time-config.component.scss',
})
export class CalTimeConfigComponent {
  readonly calendarStore = inject(CalendarStore);

  usedFields = new FormGroup(new CalConfigTimeDetail());
  frequTypes: FrequTypeUI[] = [
    { name: 'Nie', frequType: 0 },
    { name: 'Wöchentlich', frequType: 1 },
  ];

  _timeConf!: CalenderTimeConfig;
  get timeConf() {
    return this._timeConf;
  }
  @Input({ required: true }) set timeConf(el: CalenderTimeConfig) {
    this._timeConf = el;
    this.initForm();
  }

  initForm() {
    this.calendarStore.addOneConfigDetail(this.usedFields);
    this.usedFields.patchValue(this.timeConf);
    // set the time value for the UI
    this.usedFields.controls.startTimeUI.setValue(
      this.convertMinutesToTimeString(this.timeConf.eventStartTime),
    );
    this.usedFields.controls.endTimeUI.setValue(
      this.convertMinutesToTimeString(this.timeConf.eventEndTime),
    );
    this.usedFields.controls.isValid.setValue(true);
    if (this.timeConf.isOnlyEntry4Day) {
      this.usedFields.controls.isOnlyEntry4day.setValue(true);
    }
    this.usedFields.controls.endTimeUI.valueChanges.subscribe((value) => {
      const minuteVal = this.convertStringToMinutes(value ?? '00:00');
      this.usedFields.controls.eventEndTime.setValue(minuteVal);
    });
    this.usedFields.controls.startTimeUI.valueChanges.subscribe((value) => {
      const minuteVal = this.convertStringToMinutes(value ?? '00:00');
      this.usedFields.controls.eventStartTime.setValue(minuteVal);
    });

    this.usedFields.controls.frequStart.setValue(this.timeConf.eventStartDate);
    this.usedFields.controls.frequEnd.setValue(this.timeConf.eventEndDate);
    this.usedFields.controls.frequType.setValue(this.timeConf.frequType);
  }

  convertMinutesToTimeString(minutesSinceMidnight: number) {
    if (!minutesSinceMidnight) {
      return '00:00';
    }
    const hours = Math.trunc(minutesSinceMidnight / 60); // Get the hours from the minutes
    const minutes = minutesSinceMidnight % 60; // Get the minutes from the minutes

    const hoursString = hours.toString().padStart(2, '0'); // Pad hours with leading '0'
    const minutesString = minutes.toString().padStart(2, '0'); // Pad minutes with leading '0'

    return `${hoursString}:${minutesString}`;
  }
  convertStringToMinutes(timeString: string): number {
    const timeRegex = /^(\d+)(?::(\d+))?$/;
    const match = timeRegex.exec(timeString);

    if (!match) {
      throw new Error('Invalid time string');
    }

    const hours = parseInt(match[1] ?? '0');
    const minutes = parseInt(match[2] ?? '0');

    return hours * 60 + minutes;
  }

  remove() {
    const keepStatus = this.usedFields.controls.isValid.getRawValue();
    if (keepStatus) {
      this.usedFields.controls.isValid.setValue(false);
      this.usedFields.disable();
    } else {
      this.usedFields.controls.isValid.setValue(true);
      this.usedFields.enable();
    }
  }

  addEvent() {
    this.calendarStore.addEvent2Cal();
  }
}
