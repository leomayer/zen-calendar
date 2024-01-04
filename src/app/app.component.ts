import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { AppStoreService, CalendarStore } from './app-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'zen-calendar';
  isDialogOpened = false;

  @ViewChild('configComponent', { read: ViewContainerRef })
  configComponent!: ViewContainerRef;
  readonly calendarStore = inject(CalendarStore);

  constructor(
    private elementRef: ElementRef,
    store: AppStoreService,
  ) {
    const useConfigInterface = this.stringToBoolean(
      this.elementRef.nativeElement.getAttribute('useConfigInterface'),
    );
    this.calendarStore.patchInterfaceType(useConfigInterface);
  }
  stringToBoolean(value: unknown) {
    return (
      !!value &&
      (String(value) === '1' || String(value).toLowerCase() === 'true')
    );
  }
}
