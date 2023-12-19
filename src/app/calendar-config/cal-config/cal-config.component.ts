import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { AppStoreService } from '@app/app-store.service';
//import { setValue } from '@app/helpers/calendar.functions.helper';
import { CalenderService } from '@app/helpers/calender.service';
import {
  CalConfigDetail,
  CalendarEventShort,
  CalenderInfo,
  CalenderInfoConfig,
  CalenderTimeConfig,
  DefaultCalenderInfo,
  EventFrequ,
} from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-cal-config',
  templateUrl: './cal-config.component.html',
  styleUrls: ['./cal-config.component.scss'],
})
export class CalConfigComponent implements OnInit {
  events = {} as CalendarEventShort;
  details = [] as CalenderInfo[];
  duration = 0;
  calConfigDetForm = new FormGroup({
    fields: new FormArray<FormGroup<CalConfigDetail>>([]),
  });

  lstOfConfigDetailsPerDay = [] as CalenderTimeConfig[];
  lstBACKUP_OfConfigDetailsPerDay = [] as CalenderTimeConfig[];

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
    const detailList = await this.calService.getEventsDetailsByIds(
      events.eventIds,
    );
    this.lstOfConfigDetailsPerDay = this.createConfigDetails(
      detailList,
      events,
    );
    this.lstBACKUP_OfConfigDetailsPerDay = structuredClone(
      this.lstOfConfigDetailsPerDay,
    );
    this.details = detailList;
    this.createCalConfigForm();

    this.duration = new Date().getTime() - start;
  }

  performChangeCheck() {
    const change = [] as CalenderInfo[];
    /*
    const newVals = this.calConfigDetForm.getRawValue().fields;
    let index = 0;
    this.details.forEach((oldVal) => {
      let hasChanges = false;
      const updatedEntry = new DefaultCalenderInfo();
      const formDayEntry = newVals[index];

      for (const [key, value] of Object.entries(oldVal)) {
        const castKey = key as keyof CalenderInfo;
        if (formDayEntry) {
          const newVal = formDayEntry[castKey] ?? null;
          if (value !== newVal) {
            hasChanges = true;
          }
          setValue(updatedEntry, castKey, newVal);
        } else {
          setValue(updatedEntry, castKey, value);
        }
      }
      if (hasChanges) {
        change.push(updatedEntry);
      }
      index++;
    });
    */
    console.log('before change:', this.details);
    console.log(change);
  }

  createConfigDetails(
    detailList: CalenderInfoConfig[],
    events: CalendarEventShort,
  ) {
    const lstOfConfigDetailsPerDay = [] as CalenderTimeConfig[];
    events.addInfo?.forEach((addInfo) => {
      const listOfUsedStartTimes = [] as number[];
      const filteredDetails = detailList.filter(
        (chk) => chk.cal_basic_id === addInfo.frequ_id,
      );
      for (const confEntry of filteredDetails) {
        let event = lstOfConfigDetailsPerDay.find(
          (conf) => conf.startTime === confEntry.startTime,
        );
        if (!event) {
          event = this.createNewConfTime(confEntry, addInfo);
          listOfUsedStartTimes.push(confEntry.startTime);
          lstOfConfigDetailsPerDay.push(event);
        }
        const confDetail = {
          id: confEntry.id,
          title: confEntry.title,
          description: confEntry.description,
          lang: confEntry.lang,
          link: confEntry.link,
          linkType: confEntry.linkType,
        };
        event.configDet.push(confDetail);
      }
    });
    return lstOfConfigDetailsPerDay;
  }
  createNewConfTime(confEntry: CalenderInfoConfig, addInfo: EventFrequ) {
    const frequConfig = {
      cal_basic_id: addInfo.frequ_id,
      startTime: confEntry.startTime,
      endTime: confEntry.endTime,
      frequ_start: addInfo.frequ_start,
      frequ_end: addInfo.frequ_end,
      frequ_type: addInfo.frequ_type,
      is_only_entry4day: addInfo.is_only_entry4day,
      configDet: [],
    };

    return frequConfig;
  }

  addEvent() {
    this.details.push(new DefaultCalenderInfo());
  }

  private createCalConfigForm(): void {
    this.calConfigDetForm.controls.fields = new FormArray<
      FormGroup<CalConfigDetail>
    >([]);
  }
}
