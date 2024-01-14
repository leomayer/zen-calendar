import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export type LoadingState =
  | 'init'
  | 'loading'
  | 'loaded'
  | 'verifySave'
  | 'saving'
  | { error: string };

export function withCallState() {
  return signalStoreFeature(
    withState<{
      loadingState: LoadingState;
      loadingTime: number;
      savingTime: number;
    }>({
      loadingState: 'init',
      loadingTime: 0,
      savingTime: 0,
    }),
    withMethods((state) => {
      //withMethods(({ loadingState: callState }) => {
      let loadingStart = 0;
      let savingStart = 0;
      return {
        setLoading() {
          loadingStart = Date.now();
          patchState(state, { loadingState: 'loading' });
          if (savingStart) {
            patchState(state, { savingTime: Date.now() - savingStart });
            savingStart = 0;
          }
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
          patchState(state, { savingTime: Date.now() - savingStart });
          loadingStart = Date.now();
          savingStart = Date.now();
        },
        setVerifySave() {
          patchState(state, { loadingState: 'verifySave' });
        },
        setSaving() {
          patchState(state, { loadingState: 'saving' });
          savingStart = Date.now();
        },
      };
    }),
    withComputed(({ loadingState }) => ({
      status: computed(() => {
        const state = loadingState();
        return typeof state === 'object' ? state.error : state;
      }),
      hasErrors: computed(() => {
        const state = loadingState();
        return typeof state === 'object';
      }),
    })),
  );
}
