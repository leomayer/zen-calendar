import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarStore } from '@app/app-store.service';
import { formatDate4Wordpress } from '@app/helpers/calendar.functions.helper';
import {
  CalConfigDetail,
  CalConfigTimeDetail,
  WordpressUpdateBasic,
  WordpressUpdateDetails,
} from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-cal-save-config',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './cal-save-config.component.html',
  styleUrl: './cal-save-config.component.scss',
})
export class CalSaveConfigComponent {
  readonly calendarStore = inject(CalendarStore);
  saveChanges() {
    const changes = this.calendarStore.getChanges();
    changes.forEach((changedEvent) => this.saveIndividualEntry(changedEvent));
  }
  saveIndividualEntry(changedCalEvent: FormGroup<CalConfigTimeDetail>): void {
    if (changedCalEvent.controls.id.value) {
      this.updateCalEvent(changedCalEvent);
    } else {
      this.insertCalEvent(changedCalEvent);
    }
  }
  updateCalEvent(changedCalEvent: FormGroup<CalConfigTimeDetail>) {
    const updateDetails = changedCalEvent.controls.fields.controls.filter(
      (ctrl) => ctrl.dirty,
    );
    updateDetails.forEach((det) =>
      this.updateCalDetails(det, changedCalEvent.controls.id.value ?? 0),
    );
    this.updateCalOverview(changedCalEvent);
  }
  updateCalDetails(
    updateCalDetails: FormGroup<CalConfigDetail>,
    calBasicId: number,
  ) {
    const ctrl = updateCalDetails.controls;
    const updateDetails = {
      id: ctrl.id.value + '',
      calBasicId: calBasicId + '',
      title: ctrl.title.value + '',
      description: ctrl.description.value + '',
      lang: ctrl.lang.value + '',
      link: ctrl.link.value + '',
      linkTitle: ctrl.linkTitle.value + '',
      linkType: ctrl.linkType.value + '',
    } as WordpressUpdateDetails;
    console.log('update changes - details ', updateDetails);
  }
  updateCalOverview(changedCalEvent: FormGroup<CalConfigTimeDetail>) {
    const ctrl = changedCalEvent.controls;
    const updateOverview = {
      id: ctrl.id.value + '',
      eventStartDate: formatDate4Wordpress(ctrl.frequStart.value),
      eventStartTime: ctrl.eventStartTime.value + '',
      eventEndDate: formatDate4Wordpress(ctrl.frequEnd.value),
      eventEndTime: ctrl.eventEndTime.value + '',
      frequType: ctrl.frequType.value + '',
      isOnlyEntry4Day: ctrl.isOnlyEntry4day ? '1' : '0',
      isValid: ctrl.isValid.value ? '1' : '0',
    } as WordpressUpdateBasic;
    console.log('update changes - overview ', updateOverview);
  }
  insertCalEvent(changedCalEvent: FormGroup<CalConfigTimeDetail>) {
    console.log(
      'insert changes ',
      changedCalEvent.controls.eventStartTime.value,
    );
  }
}
