import { Injectable, computed, effect, inject } from '@angular/core';
import { Subject } from 'rxjs';
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
};
const initialState: t_initialState = {
  showDialog: false,
  useConfigInterface: false,
  configLang: '',
  displayDate: null,
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
      if (!environment.production)
        effect(() =>
          console.log('loading state changed', state.loadingState()),
        );
    },
  }),
  withSignalsConfigDetails(),
  withSignalsDisplayDialog(),
  withMethods((state) => {
    const calServiceHelper = inject(CalendarHelper);
    //const calConfigCheck = inject(CalConfigComponent);

    return {
      patchInterfaceType(useConfigInterface: boolean) {
        patchState(state, { useConfigInterface });
      },
      patchDate(displayDate: Date | null) {
        // calConfigCheck.performChangeCheck();
        patchState(state, { displayDate });
      },
      patchLang(displayLang: string) {
        patchState(state, { configLang: displayLang });
      },
      patchEvents(events: CalenderInfo[]) {
        patchState(state, { events });
      },
      async loadDetails(data: CalendarEventLangs) {
        if (state.useConfigInterface()) {
          state.loadConfigDetails(data);
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
