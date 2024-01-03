import { Injectable, computed, inject } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import {
  CalendarEventLangs,
  CalendarEventShort,
  CalenderInfo,
} from './helpers/calenderTypes';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';
import { CalendarHelper } from './helpers/calender.test-helper.service';
import { withSignalsDisplayDialog } from '@calendar/cal-details-dialog/cal-details-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  public readonly state = {
    monthChanged: new Subject<Date>(),
    eventIdSelected: new Subject<CalendarEventShort>(),
    editEvent: new ReplaySubject<CalendarEventShort>(),
    editEvent2Add: new Subject<boolean>(),
    displayEvent: new Subject<CalendarEventShort>(),
  } as const;
}
const initialState = {
  loading: false,
  showDialog: false,
  useConfigInterface: false,
  configLang: '',
  displayDate: new Date(),
  events: [] as CalenderInfo[],
};

export const CalendarStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks({
    onInit(state) {
      const configLang = document.documentElement.lang?.substring(0, 2) ?? 'en';
      patchState(state, { configLang });
    },
  }),
  withSignalsDisplayDialog(),
  withMethods((state) => {
    const calServiceHelper = inject(CalendarHelper);
    return {
      patchDate(displayDate: Date) {
        patchState(state, { displayDate });
      },
      patchEvents(events: CalenderInfo[]) {
        patchState(state, { events });
      },
      async loadDetails(data: CalendarEventLangs) {
        if (data && data.start) {
          patchState(state, { loading: true });
          const useEventIds = (data.onlyEventId4Day ??
            data.eventIds.join()) as string;

          const events =
            (await calServiceHelper.getEventsViaSignal(
              useEventIds,
              state.configLang(),
            )) ?? [];
          console.log('oading...', events);
          patchState(state, { loading: false });
          this.patchEvents(events);
          state.displayDialog(!state.useConfigInterface());
        } else {
          this.patchEvents([]);
        }
      },
    };
  }),
  withComputed((state) => {
    return {
      eventLang: computed(() => `used Lang:${state?.configLang}`),
      matDisplayDialog: computed(() => `display Dialog: ${state.showDialog()}`),
    };
  }),
);
