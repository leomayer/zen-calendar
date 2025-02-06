import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {
  CalConfigDetail,
  CalConfigFormDto,
  CalLinkTypeUI,
} from '@app/helpers/calenderTypes';

@Component({
    selector: 'app-cal-config-detail',
    styleUrl: './cal-config-detail.component.scss',
    templateUrl: './cal-config-detail.component.html',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatOptionModule,
        MatRadioModule,
        MatInputModule,
        MatSelectModule,
    ]
})
export class CalConfigDetailComponent {
  usedFields = new FormGroup(new CalConfigDetail());
  linkTypes: CalLinkTypeUI[] = [
    { name: 'email', linkType: 'email' },
    { name: 'Link/URL', linkType: 'url' },
    { name: 'Zoom', linkType: 'zoom' },
    { name: 'Nicht vorhanden', linkType: null },
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
    this.usedFields.markAsPristine();
  }

  updateTitle(newTitle: string) {
    this.usedFields.controls.title.setValue(newTitle);
  }

  updateContent(newContent: string) {
    this.usedFields.controls.description.setValue(newContent);
  }
}
