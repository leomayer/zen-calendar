import { Injectable, inject } from '@angular/core';
import { AppStoreService, CalendarStore } from '@app/app-store.service';
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
  readonly appInfo = inject(AppStoreService);

  saveChanges() {
    this.calendarStore.setSaving();
    const changes = this.calendarStore.getChanges();

    changes.forEach((changedEvent) => this.saveIndividualEntry(changedEvent));
  }
  async saveIndividualEntry(
    changedCalEvent: FormGroup<CalConfigTimeDetail>,
  ): Promise<void> {
    const isUpdate = changedCalEvent.controls.id.value;
    if (isUpdate) {
      await this.updateCalEvent(changedCalEvent);
    } else {
      await this.insertCalEvent(changedCalEvent);
    }
    if (!this.calendarStore.hasErrors()) {
      this.calendarStore.markDetailsPristine();
      this.calendarStore.setSaved();
      this.appInfo.state.monthChanged.next(
        this.calendarStore.selectedMonth() ?? new Date(),
      );
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
          true,
        );
      }
    }
    if (!this.calendarStore.hasErrors()) {
      this.updateCalOverview(changedCalEvent, true);
    }
  }
  async updateCalDetails(
    updateCalDetails: FormGroup<CalConfigDetail>,
    calBasicId: number,
    isUpdate: boolean,
  ) {
    const ctrl = updateCalDetails.controls;
    const updateDetails = {
      id: isUpdate ? ctrl.id.value + '' : '',
      calBasicId: calBasicId + '',
      title: ctrl.title.value + '',
      description: ctrl.description.value + '',
      lang: ctrl.lang.value + '',
      link: ctrl.link.value + '',
      linkTitle: ctrl.linkTitle.value + '',
      linkType: ctrl.linkType.value ?? '' + '',
      isUpdate: isUpdate ? '1' : '0',
    } as WordpressUpdateDetails;
    try {
      await this.calServiceHelper.updateEventDetails(updateDetails);
    } catch (error) {
      this.calendarStore.setError('Update Details failed');
    }
  }
  async updateCalOverview(
    changedCalEvent: FormGroup<CalConfigTimeDetail>,
    isUpdate: boolean,
  ): Promise<number | null> {
    const ctrl = changedCalEvent.controls;
    const updateOverview = {
      id: isUpdate ? ctrl.id.value + '' : '',
      eventStartDate: formatDate4Wordpress(ctrl.frequStart.value),
      eventStartTime: ctrl.eventStartTime.value + '',
      eventEndDate: formatDate4Wordpress(ctrl.frequEnd.value),
      eventEndTime: ctrl.eventEndTime.value + '',
      frequType: ctrl.frequType.value + '',
      isOnlyEntry4Day: ctrl.isOnlyEntry4day.value ? '1' : '0',
      isValid: ctrl.isValid.value ? '1' : '0',
      isUpdate: isUpdate ? '1' : '0',
    } as WordpressUpdateBasic;
    try {
      return await this.calServiceHelper.updateEventBasic(updateOverview);
    } catch (error) {
      this.calendarStore.setError(
        `${isUpdate ? 'Update' : 'Insert'} Basics failed`,
      );
      return null;
    }
  }
  async insertCalEvent(changedCalEvent: FormGroup<CalConfigTimeDetail>) {
    const newCalId =
      (await this.updateCalOverview(changedCalEvent, false)) ?? 0;
    console.log(
      'insert changes ',
      newCalId,
      changedCalEvent.controls.eventStartTime.value,
    );
    if (!this.calendarStore.hasErrors()) {
      changedCalEvent.controls.id.setValue(newCalId);
      for (const detail of changedCalEvent.controls.fields.controls) {
        detail.controls.calBasicId.setValue(newCalId);
        await this.updateCalDetails(detail, newCalId, false);
      }
    }
  }
}
