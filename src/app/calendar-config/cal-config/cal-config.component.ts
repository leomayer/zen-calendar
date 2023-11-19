import { Component, OnInit } from '@angular/core';
import { AppStoreService } from '@app/app-store.service';
import { CalendarEventUI } from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-cal-config',
  templateUrl: './cal-config.component.html',
  styleUrls: ['./cal-config.component.scss'],
})
export class CalConfigComponent implements OnInit {
  events!: CalendarEventUI;
  constructor(private store: AppStoreService) {}
  ngOnInit(): void {
    this.store.state.editEvent.subscribe((events) => this.editEvents(events));
  }
  editEvents(events: CalendarEventUI): void {
    this.events = events;
  }
}
