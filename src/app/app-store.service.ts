import { Injectable, computed, effect, inject } from '@angular/core';
import { CalendarEventLangs, CalenderInfo } from './helpers/calenderTypes';
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
import { withSignalsConfigDetails } from '@calConfig/cal-config/cal-config.component';
import { withCallState } from './helpers/calendar.loading';
import { environment } from 'src/environments/environment';
import { areDatesOnSameDay } from './helpers/calendar.functions.helper';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  public readonly state = {
    monthChanged: new Subject<Date>(),
  } as const;
}
export type t_initialState = {
  showDialog: boolean;
  useConfigInterface: boolean;
  configLang: string;
  displayDate: null | Date;
  events: CalenderInfo[];
  selectedMonth: null | Date;
};
const initialState: t_initialState = {
  showDialog: false,
  useConfigInterface: false,
  configLang: '',
  displayDate: null,
  selectedMonth: new Date(),
  events: [] as CalenderInfo[],
};

export const CalendarStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCallState(),
  withHooks({
    onInit(state) {
      const configLang = document.documentElement.lang?.substring(0, 2) ?? 'en';
      patchState(state, { configLang });
      if (!environment.production) {
        effect(() =>
          console.log('loading state changed', state.loadingState()),
        );
      }
    },
  }),
  withSignalsConfigDetails(),
  withSignalsDisplayDialog(),
  withMethods((state) => {
    const calServiceHelper = inject(CalendarHelper);

    return {
      patchInterfaceType(useConfigInterface: boolean) {
        patchState(state, { useConfigInterface });
      },
      patchDate(displayDate: Date | null) {
        patchState(state, { displayDate });
      },
      patchLang(displayLang: string) {
        patchState(state, { configLang: displayLang });
      },
      patchEvents(events: CalenderInfo[]) {
        patchState(state, { events });
      },
      setSelectedMonth(selectedMonth: Date) {
        patchState(state, { selectedMonth });
      },
      isSelectedDate(checkDate: Date) {
        if (state.useConfigInterface()) {
          return areDatesOnSameDay(
            state.displayDate() ?? new Date(),
            checkDate,
          );
        } else {
          return areDatesOnSameDay(new Date(), checkDate);
        }
      },
      async loadDetails(data: CalendarEventLangs) {
        if (state.useConfigInterface()) {
          await state.loadConfigDetails(data);
        } else {
          if (data?.eventIds) {
            state.setLoading();
            const useEventIds = (data.onlyEventId4Day ??
              data.eventIds.join()) as string;

            const events =
              (await calServiceHelper.getEventsViaSignal(
                useEventIds,
                state.configLang(),
              )) ?? [];
            state.setLoaded();
            this.patchEvents(events);
            state.displayDialog(true);
          } else {
            // no ids are given
            this.patchEvents([]);
          }
        }
      },
    };
  }),
  withComputed((state) => {
    return {
      eventLang: computed(() => {
        return state.configLang();
      }),
      isActive: computed(
        () => state.loadingState() === 'loading' || state.showDialog(),
      ),
    };
  }),
);
