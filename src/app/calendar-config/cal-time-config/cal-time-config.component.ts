import { Component, Input, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CalendarStore } from '@app/app-store.service';
import {
  CalConfigTimeDetail,
  CalenderDetConfig,
  CalenderInfo,
  CalenderTimeConfig,
  FrequType,
  FrequTypeUI,
} from '@app/helpers/calenderTypes';
import { CalConfigDetailComponent } from '@calConfig/cal-config-detail/cal-config-detail.component';

@Component({
    selector: 'app-cal-time-config',
    imports: [
        CalConfigDetailComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatOptionModule,
        MatDatepickerModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
    ],
    templateUrl: './cal-time-config.component.html',
    styleUrl: './cal-time-config.component.scss'
})
export class CalTimeConfigComponent {
  readonly FrequType = FrequType;
  readonly calendarStore = inject(CalendarStore);

  usedFields = new FormGroup(new CalConfigTimeDetail());
  frequTypes: FrequTypeUI[] = [
    { name: 'Nie', frequType: FrequType.NONE },
    { name: 'Täglich', frequType: FrequType.DAILY },
    { name: 'Wöchentlich', frequType: FrequType.WEEKLY },
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
    this.usedFields.controls.id.setValue(this.timeConf.calBasicId);
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

    this.usedFields.controls.frequType.valueChanges.subscribe((value) => {
      if (value === FrequType.NONE) {
        this.usedFields.controls.frequEnd.disable();
      } else {
        this.usedFields.controls.frequEnd.enable();
      }
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

  clone() {
    /* basic entry */
    const clonedCalEntry = {
      eventStartTime: this.usedFields.controls.eventStartTime.value,
      eventEndTime: this.usedFields.controls.eventEndTime.value,
      eventStartDate: this.calendarStore.curDate(),
      eventEndDate: this.calendarStore.curDate(),
      calBasicId: null,
      frequType: this.usedFields.controls.frequType.value,
      configDet: [] as CalenderDetConfig[],
    } as CalenderTimeConfig;
    /* details in German */

    const infoDe = structuredClone(
      this.timeConf.configDet.find((chk) => (chk.lang = 'de')),
    ) as CalenderInfo;
    infoDe.id = null;
    infoDe.calBasicId = null;

    clonedCalEntry.configDet.push(infoDe);
    /* details in English */
    const infoEn = structuredClone(
      this.timeConf.configDet.find((chk) => (chk.lang = 'en')),
    ) as CalenderInfo;
    infoDe.id = null;
    infoDe.calBasicId = null;

    clonedCalEntry.configDet.push(infoEn);

    this.calendarStore.lstOfConfigDetailsPerDay().push(clonedCalEntry);
  }
  addEvent() {
    this.calendarStore.addEvent2Cal();
  }
}
