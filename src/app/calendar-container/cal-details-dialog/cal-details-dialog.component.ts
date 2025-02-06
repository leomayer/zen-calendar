import { DatePipe, JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { CalendarStore } from '@app/app-store.service';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TimeFormatterComponent } from '../time-formatter/time-formatter.component';
import { LinkDetailsComponent } from '../link-details/link-details.component';

export function withSignalsDisplayDialog() {
  return signalStoreFeature(
    withMethods((state) => {
      const dialog = inject(MatDialog);
      return {
        displayDialog(showDialog: boolean) {
          patchState(state, { showDialog });
          if (showDialog) {
            const dialogRef = dialog.open(CalDetailsDialogComponent, {
              width: '250px',
              backdropClass: 'cdk-overlay-transparent-backdrop',
              hasBackdrop: true,
              enterAnimationDuration: '500ms',
              exitAnimationDuration: '500ms',
            });
            dialogRef
              .afterClosed()
              .subscribe(() => patchState(state, { showDialog: false }));
          }
        },
      };
    }),
  );
}

type bodyDetails = {
  height: string;
  position: string;
  overflow: string;
  scrolly: number;
  top: string;
  width: string;
};

@Component({
    selector: 'app-cal-details-dialog',
    templateUrl: './cal-details-dialog.component.html',
    styleUrls: ['./cal-details-dialog.component.scss'],
    providers: [DatePipe, JsonPipe],
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        TimeFormatterComponent,
        LinkDetailsComponent,
        DatePipe,
    ]
})
export class CalDetailsDialogComponent implements OnInit, OnDestroy {
  memoBody: bodyDetails = {} as bodyDetails;
  readonly calendarStore = inject(CalendarStore);

  constructor(public datePipe: DatePipe) {}
  ngOnInit(): void {
    const body = document.body;
    // memorize the current postion
    this.memoBody.scrolly = window.scrollY;
    this.memoBody.top = body.style.top;
    this.memoBody.position = body.style.position;
    this.memoBody.overflow = body.style.overflow;
    this.memoBody.width = body.style.width;
    this.memoBody.height = body.style.height;
    // adjust the positions since we want to prevent some other problems for display this modal dialog
    body.style.top = `-${this.memoBody.scrolly}`;
    body.style.position = 'fixed';
    body.style.overflow = 'hidden';
    body.style.width = '100%';
    body.style.height = '100%';
  }
  ngOnDestroy(): void {
    const body = document.body;
    // restore the memorized positions
    body.style.position = this.memoBody.position;
    body.style.overflow = this.memoBody.overflow;
    body.style.width = this.memoBody.width;
    body.style.height = this.memoBody.height;
    body.style.top = this.memoBody.top;
    window.scrollTo(0, (this.memoBody.scrolly || 0) * -1);
  }
}
