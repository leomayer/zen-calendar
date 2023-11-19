import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AppStoreService } from './app-store.service';
import { CalendarEventUI } from './helpers/calenderTypes';
import { CalDetailsDialogComponent } from '@calendar/cal-details-dialog/cal-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

    private dialog: MatDialog,
    store: AppStoreService,
  ) {
    this.useConfigInterface = this.stringToBoolean(
      this.elementRef.nativeElement.getAttribute('useConfigInterface'),
    );

    store.state.eventSelected.subscribe((events) => {
      if (this.useConfigInterface) {
        store.state.editEvent.next(events);
      } else {
        this.displayEvent(events);
      }
    });
  }
  displayEvent(data: CalendarEventUI) {
    this.dialog.open(CalDetailsDialogComponent, {
      data,
      width: '250px',
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
    });
  }

  stringToBoolean(value: unknown) {
    return (
      !!value &&
      (String(value) === '1' || String(value).toLowerCase() === 'true')
    );
  }
}
