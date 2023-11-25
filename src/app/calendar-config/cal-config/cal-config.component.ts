import { Component, OnInit } from '@angular/core';
import { AppStoreService } from '@app/app-store.service';
import { CalenderService } from '@app/helpers/calender.service';
import { CalendarEventShort, CalenderInfo } from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-cal-config',
  templateUrl: './cal-config.component.html',
  styleUrls: ['./cal-config.component.scss'],
})
export class CalConfigComponent implements OnInit {
  events = {} as CalendarEventShort;
  details = {} as CalenderInfo[];

  constructor(
    private store: AppStoreService,
    private calService: CalenderService,
  ) {}
  ngOnInit(): void {
    this.store.state.editEvent.subscribe((events) => this.editEvents(events));
  }
  async editEvents(events: CalendarEventShort): Promise<void> {
    this.events = events;
    this.details = await this.calService.getEventsDetailsByIds(events.eventIds);
  }
}
