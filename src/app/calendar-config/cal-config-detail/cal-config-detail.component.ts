import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppStoreService } from '@app/app-store.service';
import {
  CalConfigDetail,
  CalConfigFormDto,
  CalLinkTypeUI,
} from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-cal-config-detail',
  templateUrl: './cal-config-detail.component.html',
  styleUrl: './cal-config-detail.component.scss',
})
export class CalConfigDetailComponent {
  usedFields = new FormGroup(new CalConfigDetail());
  linkTypes: CalLinkTypeUI[] = [
    { name: 'email', linkType: 'email' },
    { name: 'Link/URL', linkType: 'url' },
    { name: 'Zoom', linkType: 'zoom' },
    { name: 'Nicht vorhanden', linkType: undefined },
  ];

  _data_info!: CalConfigFormDto;
  get dataInfo(): CalConfigFormDto {
    return this._data_info;
  }
  @Input() set dataInfo(value: CalConfigFormDto) {
    this._data_info = value;
    this.initForm();
  }

  constructor(private store: AppStoreService) {}

  initForm() {
    this.usedFields.patchValue(this.dataInfo.data);
    this.usedFields.controls.keepEntry.setValue(true);
    // set the time value for the UI
    this.usedFields.controls.startTimeUI.setValue(
      this.convertMinutesToTimeString(this.dataInfo.data.startTime),
    );
    this.usedFields.controls.endTimeUI.setValue(
      this.convertMinutesToTimeString(this.dataInfo.data.endTime),
    );
    this.dataInfo.fields.push(this.usedFields);
    this.usedFields.controls.endTime.valueChanges.subscribe((value) =>
      console.log('changed end:', value, typeof value),
    );

    this.usedFields.controls.isOnlyEntry4day.valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          this.usedFields.controls.startTimeUI.disable();
          this.usedFields.controls.endTimeUI.disable();
        } else {
          this.usedFields.controls.startTimeUI.enable();
          this.usedFields.controls.endTimeUI.enable();
        }
      },
    );
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
  updateTitle(newTitle: string) {
    this.usedFields.controls.title.setValue(newTitle);
  }

  updateContent(newContent: string) {
    this.usedFields.controls.description.setValue(newContent);
  }
  remove() {
    const keepStatus = this.usedFields.controls.keepEntry.getRawValue();
    if (keepStatus) {
      this.usedFields.controls.keepEntry.setValue(false);
      this.usedFields.disable();
    } else {
      this.usedFields.controls.keepEntry.setValue(true);
      this.usedFields.enable();
    }
  }
  addEntry() {
    this.store.state.editEvent2Add.next(true);
  }
}
