import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AppStoreService } from './app-store.service';
import { CalendarEventLangs, CalendarEventUI } from './helpers/calenderTypes';
import { CalDetailsDialogComponent } from '@calendar/cal-details-dialog/cal-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CalenderService } from './helpers/calender.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'zen-calendar';

  protected useConfigInterface: boolean = false;
  @ViewChild('configComponent', { read: ViewContainerRef })
  configComponent!: ViewContainerRef;

  constructor(
    private elementRef: ElementRef,
    private calService: CalenderService,
    private dialog: MatDialog,
    store: AppStoreService,
  ) {
    this.useConfigInterface = this.stringToBoolean(
      this.elementRef.nativeElement.getAttribute('useConfigInterface'),
    );

    store.state.eventIdSelected.subscribe((events) => {
      if (this.useConfigInterface) {
        store.state.editEvent.next(events);
      } else {
        store.state.displayEvent.next(events);
      }
    });
    store.state.displayEvent.subscribe((event) => {
      this.displayEvent(event);
    });
  }
  async displayEvent(event: CalendarEventLangs) {
    const events = await this.calService.getEventsByIds(event);
    if (events.length) {
      const data = {
        selDate: event.start,
        events,
      } as CalendarEventUI;

      this.dialog.open(CalDetailsDialogComponent, {
        data,
        width: '250px',
        backdropClass: 'cdk-overlay-transparent-backdrop',
        hasBackdrop: true,
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '500ms',
      });
    }
  }
  stringToBoolean(value: unknown) {
    return (
      !!value &&
      (String(value) === '1' || String(value).toLowerCase() === 'true')
    );
  }
}
