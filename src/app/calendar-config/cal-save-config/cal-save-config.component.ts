import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { withSignalsConfigDetails } from '@calConfig/cal-config/cal-config.component';
import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

export function withSignalsSave() {
  return signalStoreFeature(
    withState<{ confirmDialog: boolean }>({ confirmDialog: false }),
    withSignalsConfigDetails(),
    withMethods((state) => {
      const dialog = inject(MatDialog);

      return {
        async ask4Save() {
          state.setVerifySave();
          const dialogRef = dialog.open(CalSaveConfigComponent, {
            width: '250px',
            backdropClass: 'cdk-overlay-transparent-backdrop',
            hasBackdrop: true,
            enterAnimationDuration: '500ms',
            exitAnimationDuration: '500ms',
          });
          firstValueFrom(dialogRef.afterClosed()).then((result) => {
            state.setLoaded();
            console.log('confirm?', result);
            patchState(state, { confirmDialog: result });
          });
        },
      };
    }),
  );
}

@Component({
  selector: 'app-cal-save-config',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './cal-save-config.component.html',
  styleUrl: './cal-save-config.component.scss',
})
export class CalSaveConfigComponent {}
