import { Component, computed, inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CalendarStore } from '@app/app-store.service';
import { withCallState } from '@app/helpers/calendar.loading';
//import { setValue } from '@app/helpers/calendar.functions.helper';
import { CalendarHelper } from '@app/helpers/calender.test-helper.service';
import {
  CalConfigDetail,
  CalConfigTimeDetail,
  CalendarEventLangs,
  CalendarEventShort,
  CalenderDetConfig,
  CalenderInfoConfig,
  CalenderTimeConfig,
  DefaultCalenderInfoDe,
  DefaultCalenderInfoEn,
  EventFrequ,
} from '@app/helpers/calenderTypes';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export function withSignalsConfigDetails() {
  return signalStoreFeature(
    withState<{
      lstOfConfigDetailsPerDay: CalenderTimeConfig[];
      curDate: Date;
      calConfigDet: FormGroup<CalConfigTimeDetail>[];
    }>({
      lstOfConfigDetailsPerDay: [],
      curDate: new Date(),
      calConfigDet: [],
    }),
    withCallState(),
    withMethods((state) => {
      const calServiceHelper = inject(CalendarHelper);
      return {
        async loadConfigDetails(data: CalendarEventLangs) {
          state.setLoading();
          patchState(state, { curDate: data.start });
          try {
            const detailList = await calServiceHelper.getEventsDetailsByIds(
              data.eventIds,
            );
            patchState(state, {
              lstOfConfigDetailsPerDay: createConfigDetails(detailList, data),
            });
            // clear the previous controls
            patchState(state, { calConfigDet: [] });
            state.setLoaded();
          } catch (error) {
            state.setError(error);
          }
        },
        addEvent2Cal() {
          const newCalEntry = {
            eventStartTime: 0,
            eventEndTime: 0,
            eventStartDate: state.curDate(),
            eventEndDate: state.curDate(),
            cal_basic_id: null,
            frequType: 0,
            configDet: [] as CalenderDetConfig[],
          } as CalenderTimeConfig;
          newCalEntry.configDet.push(new DefaultCalenderInfoDe());
          newCalEntry.configDet.push(new DefaultCalenderInfoEn());

          state.lstOfConfigDetailsPerDay().push(newCalEntry);
        },
        addOneConfigDetail(configDetail: FormGroup<CalConfigTimeDetail>) {
          state.calConfigDet().push(configDetail);
        },
      };
    }),
    withComputed((state) => {
      return {
        hasConfigChanges: computed(() =>
          state.calConfigDet().some((chk) => chk.dirty),
        ),
      };
    }),
  );
}

export const createConfigDetails = (
  detailList: CalenderInfoConfig[],
  events: CalendarEventShort,
) => {
  const lstOfConfigDetailsPerDay = [] as CalenderTimeConfig[];
  events.addInfo?.forEach((addInfo) => {
    const listOfUsedStartTimes = [] as number[];
    const filteredDetails = detailList.filter(
      (chk) => chk.cal_basic_id === addInfo.frequ_id,
    );
    for (const confEntry of filteredDetails) {
      let event = lstOfConfigDetailsPerDay.find(
        (conf) => conf.eventStartTime === confEntry.eventStartTime,
      );
      if (!event) {
        event = createNewConfTime(confEntry, addInfo);
        listOfUsedStartTimes.push(confEntry.eventStartTime);
        lstOfConfigDetailsPerDay.push(event);
      }
      const confDetail = {
        id: confEntry.id,
        title: confEntry.title,
        description: confEntry.description,
        lang: confEntry.lang,
        link: confEntry.link,
        linkType: confEntry.linkType,
        linkTitle: confEntry.linkTitle,
      };
      event.configDet.push(confDetail);
    }
  });
  return lstOfConfigDetailsPerDay;
};
export const createNewConfTime = (
  confEntry: CalenderInfoConfig,
  addInfo: EventFrequ,
) => {
  const frequConfig = {
    cal_basic_id: addInfo.frequ_id,
    eventStartTime: confEntry.eventStartTime,
    eventEndTime: confEntry.eventEndTime,
    eventStartDate: addInfo.eventStartDate,
    eventEndDate: addInfo.eventEndDate,
    frequType: addInfo.frequType,
    isOnlyEntry4Day: addInfo.isOnlyEntry4Day,
    configDet: [],
  };

  return frequConfig;
};

@Component({
  selector: 'app-cal-config',
  templateUrl: './cal-config.component.html',
  styleUrls: ['./cal-config.component.scss'],
})
export class CalConfigComponent {
  calConfigDetForm = new FormGroup({
    fields: new FormArray<FormGroup<CalConfigDetail>>([]),
  });

  lstBACKUP_OfConfigDetailsPerDay = [] as CalenderTimeConfig[];

  readonly calendarStore = inject(CalendarStore);

  performChangeCheck() {
    console.log('run check if something has been changed: editEvents?');
    //const change = [] as CalenderInfo[];
    /*
    const newVals = this.calConfigDetForm.getRawValue().fields;
    let index = 0;
    this.details.forEach((oldVal) => {
      let hasChanges = false;
      const updatedEntry = new DefaultCalenderInfo();
      const formDayEntry = newVals[index];

      for (const [key, value] of Object.entries(oldVal)) {
        const castKey = key as keyof CalenderInfo;
        if (formDayEntry) {
          const newVal = formDayEntry[castKey] ?? null;
          if (value !== newVal) {
            hasChanges = true;
          }
          setValue(updatedEntry, castKey, newVal);
        } else {
          setValue(updatedEntry, castKey, value);
        }
      }
      if (hasChanges) {
        change.push(updatedEntry);
      }
      index++;
    });
    */
    //    console.log('before change:', this.details);
    //    console.log(change);
  }

  /*
  private createCalConfigForm(): void {
    this.calConfigDetForm.controls.fields = new FormArray<
      FormGroup<CalConfigDetail>
    >([]);
  }
  */
}
