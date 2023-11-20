import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { AppStoreService } from '@app/app-store.service';
import { CalendarEventShort } from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-cal-button-details',
  templateUrl: './cal-button-details.component.html',
  styleUrls: ['./cal-button-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalButtonDetailsComponent {
  events = {} as CalendarEventShort;

  constructor(
    private store: AppStoreService,
    private cd: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this.store.state.editEvent.subscribe((events) => this.editEvents(events));
  }
  editEvents(events: CalendarEventShort): void {
    this.events = events;
    this.cd.detectChanges();
  }

  openDialog(lang: string) {
    const requData = { ...this.events, lang };
    this.store.state.displayEvent.next(requData);
  }
}
