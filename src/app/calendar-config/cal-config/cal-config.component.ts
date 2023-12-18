import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { AppStoreService } from '@app/app-store.service';
import { CalenderService } from '@app/helpers/calender.service';
import {
  CalConfigDetail,
  CalendarEventShort,
  CalenderInfo,
  DefaultCalenderInfo,
} from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-cal-config',
  templateUrl: './cal-config.component.html',
  styleUrls: ['./cal-config.component.scss'],
})
export class CalConfigComponent implements OnInit {
  events = {} as CalendarEventShort;
  details = {} as CalenderInfo[];
  duration = 0;
  calConfigForm = new FormGroup({
    fields: new FormArray<FormGroup<CalConfigDetail>>([]),
  });

  constructor(
    private store: AppStoreService,
    private calService: CalenderService,
  ) {}
  ngOnInit(): void {
    this.store.state.editEvent.subscribe((events) => this.editEvents(events));
    this.store.state.editEvent2Add.subscribe(() => this.addEvent());
  }
  async editEvents(events: CalendarEventShort): Promise<void> {
    this.performChangeCheck();
    const start = new Date().getTime();
    this.events = events;
    this.details = await this.calService.getEventsDetailsByIds(events.eventIds);
    this.createCalConfigForm();

    this.duration = new Date().getTime() - start;
  }

  performChangeCheck() {
    console.log('before change:', this.details);
    console.log(this.calConfigForm.getRawValue());
  }

  addEvent() {
    this.details.push(new DefaultCalenderInfo());
  }

  private createCalConfigForm(): void {
    this.calConfigForm.controls.fields = new FormArray<
      FormGroup<CalConfigDetail>
    >([]);
  }
}
