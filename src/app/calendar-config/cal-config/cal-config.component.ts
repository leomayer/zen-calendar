import { Component, computed, inject } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { CalTimeConfigComponent } from '../cal-time-config/cal-time-config.component';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';

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
      const evalChanged = (chk: FormGroup<CalConfigTimeDetail>) =>
        // either changed
        chk.dirty ||
        // or newly created
        !chk.controls.id.value ||
        // set to invalid (aka remove)
        !chk.controls.isValid.value;
      return {
        setCurrentDate(curDate: Date) {
          patchState(state, {
            curDate,
          });
        },

        async loadConfigDetails(data: CalendarEventLangs) {
          state.setLoading();
          this.setCurrentDate(data.start);
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
            calBasicId: null,
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
        hasConfigChanges() {
          return state.calConfigDet().some(evalChanged);
        },
        getChanges() {
          return state.calConfigDet().filter(evalChanged);
        },
        markDetailsPristine() {
          state.calConfigDet().forEach((ctrl) => ctrl.markAsPristine());
        },
        getFormError() {
          const invalid = [];
          const controls = state.calConfigDet();
          for (const ctrlGroup of controls) {
            for (const name in ctrlGroup.controls) {
              const castedName = name as keyof typeof ctrlGroup.controls;
              if (ctrlGroup.controls[castedName].invalid) {
                const error = ctrlGroup.controls[castedName].errors ?? [];
                invalid.push(Object.keys(error)[0]);
              }
            }
          }
          return invalid.length ? [...new Set(invalid)] : null;
        },
      };
    }),
    withComputed((state) => {
      return {
        getFormError1: computed(() => {
          const invalid = [];
          const controls = state.calConfigDet();
          for (const ctrlGroup of controls) {
            for (const name in ctrlGroup.controls) {
              const castedName = name as keyof typeof ctrlGroup.controls;
              if (ctrlGroup.controls[castedName].invalid) {
                const error = ctrlGroup.controls[castedName].errors ?? [];
                invalid.push(Object.keys(error)[0]);
              }
            }
          }
          return invalid.length ? [...new Set(invalid)] : null;
        }),
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
      (chk) => chk.calBasicId === addInfo.frequ_id,
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
    calBasicId: addInfo.frequ_id,
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
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CalTimeConfigComponent,
        MatButton,
        DatePipe,
    ]
})
export class CalConfigComponent {
  addEvent() {
    const selDate = this.calendarStore.displayDate();
    if (selDate !== null) {
      const offSet = Math.abs(selDate.getTimezoneOffset() * 60 * 1000);
      const curDate = new Date(selDate.getTime() + offSet);

      this.calendarStore.setCurrentDate(curDate);
      this.calendarStore.addEvent2Cal();
    }
  }
  calConfigDetForm = new FormGroup({
    fields: new FormArray<FormGroup<CalConfigDetail>>([]),
  });

  readonly calendarStore = inject(CalendarStore);
}
