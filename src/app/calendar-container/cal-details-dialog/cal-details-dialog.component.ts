import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEventUI } from '@app/helpers/calenderTypes';

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
  providers: [DatePipe],
})
export class CalDetailsDialogComponent implements OnInit, OnDestroy {
  memoBody: bodyDetails = {} as bodyDetails;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: CalendarEventUI,
    public datePipe: DatePipe,
  ) {}
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
