import { Component, OnInit } from '@angular/core';
import { AppStoreService } from '@app/app-store.service';
import { CalendarEventShort } from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-cal-config',
  templateUrl: './cal-config.component.html',
  styleUrls: ['./cal-config.component.scss'],
})
export class CalConfigComponent implements OnInit {
  events!: CalendarEventShort;
  constructor(private store: AppStoreService) {}
  ngOnInit(): void {
    this.store.state.editEvent.subscribe((events) => this.editEvents(events));
  }
  editEvents(events: CalendarEventShort): void {
    this.events = events;
  }
  openDialog(lang: string) {
    const requData = { ...this.events, lang };
    this.store.state.displayEvent.next(requData);
  }
}
