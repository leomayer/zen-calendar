import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  initForm() {
    this.usedFields.patchValue(this.dataInfo.data);
    this.dataInfo.fields.push(this.usedFields);
  }

  // Use the calConfigArray control to access and manipulate form data

  updateTitle(newTitle: string) {
    this.usedFields.controls.title.setValue(newTitle);
  }

  updateContent(newContent: string) {
    this.usedFields.controls.description.setValue(newContent);
  }
}
