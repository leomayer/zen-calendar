import { Injectable, inject } from '@angular/core';
import { CalendarStore } from '@app/app-store.service';
import { formatDate4Wordpress } from '@app/helpers/calendar.functions.helper';
import { CalendarHelper } from '@app/helpers/calender.test-helper.service';
import {
  CalConfigDetail,
  CalConfigTimeDetail,
  WordpressUpdateBasic,
  WordpressUpdateDetails,
} from '@app/helpers/calenderTypes';

import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class CalSaveService {
  readonly calendarStore = inject(CalendarStore);
  readonly calServiceHelper = inject(CalendarHelper);

  saveChanges() {
    this.calendarStore.setSaving();
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
  async updateCalEvent(changedCalEvent: FormGroup<CalConfigTimeDetail>) {
    const updateDetails = changedCalEvent.controls.fields.controls.filter(
      (ctrl) => ctrl.dirty,
    );
    for (const det of updateDetails) {
      if (!this.calendarStore.hasErrors()) {
        await this.updateCalDetails(
          det,
          changedCalEvent.controls.id.value ?? 0,
        );
      }
    }
    console.log('end loop: ', this.calendarStore.loadingState());
    if (!this.calendarStore.hasErrors()) {
      this.updateCalOverview(changedCalEvent);
    }
  }
  async updateCalDetails(
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
    try {
      await this.calServiceHelper.updateEventDetails(updateDetails);
    } catch (error) {
      this.calendarStore.setError('Update Details failed');
      console.log('error - save');
    }
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
    this.calServiceHelper.updateEventBasic(updateOverview);
  }
  insertCalEvent(changedCalEvent: FormGroup<CalConfigTimeDetail>) {
    console.log(
      'insert changes ',
      changedCalEvent.controls.eventStartTime.value,
    );
  }
}
