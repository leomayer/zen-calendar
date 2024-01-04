import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export type LoadingState = 'init' | 'loading' | 'loaded' | { error: string };

export function withCallState() {
  return signalStoreFeature(
    withState<{ loadingState: LoadingState; loadingTime: number }>({
      loadingState: 'init',
      loadingTime: 0,
    }),
    withMethods((state) => {
      //withMethods(({ loadingState: callState }) => {
      let loadingStart = 0;
      return {
        setLoading() {
          loadingStart = Date.now();
          patchState(state, { loadingState: 'loading' });
        },
        setLoaded() {
          patchState(state, { loadingState: 'loaded' });
          patchState(state, { loadingTime: Date.now() - loadingStart });
          loadingStart = Date.now();
        },
        setError(errorCause: unknown) {
          patchState(state, {
            loadingState: { error: 'errorSignal:\n' + errorCause },
          });
          patchState(state, { loadingTime: Date.now() - loadingStart });
          loadingStart = Date.now();
        },
      };
    }),
    withComputed(({ loadingState }) => ({
      status: computed(() => {
        const state = loadingState();
        return typeof state === 'object' ? state.error : state;
      }),
    })),
  );
}
