import { Injectable } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventLangs,
  CalendarEventShort,
  EventFrequ,
} from './calenderTypes';
import { CalendarTestHelper } from './calender.test-helper.service';
import {
  areDatesOnSameDay,
  getWeekdaysInMonth,
} from './calendar.functions.helper';

@Injectable({
  providedIn: 'root',
})
export class CalenderService {
  public useConfigInterface = false;
  constructor(private helper: CalendarTestHelper) {}

  async getEvents(curMonth: Date): Promise<CalendarEventShort[]> {
    const retList = [] as CalendarEventShort[];
    // get the list from the DB
    const dbList = await this.helper.getOverview4Month(curMonth);
    this.setFixedDate(dbList, retList);
    this.setRepeatingWeekDates(dbList, retList, curMonth);
    retList.sort((a, b) => a.start.getTime() - b.start.getTime());
    return retList;
  }

  async getEventsByIds(data: CalendarEventLangs) {
    return await this.helper.getEventsByIds(data);
  }
  async getEventsDetailsByIds(listOfCalIds: number[]) {
    return await this.helper.getEventsDetailsByIds(listOfCalIds);
  }

  // filter all those events which are not repeating
  setFixedDate(dbList: CalendarEvent[], retList: CalendarEventShort[]) {
    dbList
      .filter((chk) => chk.frequ_type === 0)
      .forEach((filterDay) => {
        const addDay = this.createShortEvent(filterDay);
        retList.push(addDay);
      });
  }

  setRepeatingWeekDates(
    dbList: CalendarEvent[],
    retList: CalendarEventShort[],
    curMonth: Date,
  ) {
    const useFrequType = 1;
    dbList
      .filter((chk) => chk.frequ_type === useFrequType)
      .forEach((filterDay) => {
        // get for this weekday all dates in this month
        const weekDays = getWeekdaysInMonth(
          curMonth,
          filterDay.frequ_start.getDay(),
        )
          // filter only those days which are BEFORE the end!!!
          .filter((chkDay) =>
            this.isDateWithinFilterDayInterval(filterDay, chkDay),
          );
        // for each weekday: add the event to the calendar
        weekDays.forEach((weekDay) => {
          let addDay = retList.find((chkMapDay) =>
            areDatesOnSameDay(chkMapDay.start, weekDay),
          );
          if (addDay) {
            addDay.eventIds.push(filterDay.id);
            this.appendAddInfo(filterDay, addDay);
          } else {
            const tmpDay = { ...filterDay };
            tmpDay.frequ_start = weekDay;
            addDay = this.createShortEvent(tmpDay);
            retList.push(addDay);
          }
          this.setOnlyEventInfo(filterDay, addDay);
        });
      });
  }
  setOnlyEventInfo(filterDay: CalendarEvent, addDay: CalendarEventShort) {
    if (
      filterDay.is_only_entry4day &&
      this.isDateWithinFilterDayInterval(filterDay, addDay.start)
    ) {
      addDay.onlyEventId4Day = filterDay.id;
    }
  }
  isDateWithinFilterDayInterval(filterDay: CalendarEvent, checkDay: Date) {
    return (
      (filterDay.frequ_start < checkDay ||
        areDatesOnSameDay(filterDay.frequ_start, checkDay)) &&
      (checkDay < filterDay.frequ_end ||
        areDatesOnSameDay(filterDay.frequ_end, checkDay))
    );
  }

  createShortEvent(filterDay: CalendarEvent) {
    const addDay: CalendarEventShort = {
      start: filterDay.frequ_start,
      eventIds: [filterDay.id],
    };
    this.appendAddInfo(filterDay, addDay);
    return addDay;
  }

  appendAddInfo(filterDay: CalendarEvent, addDay: CalendarEventShort) {
    if (this.useConfigInterface) {
      const addInfo = {
        frequ_id: filterDay.id,
        frequ_start: filterDay.frequ_start,
        frequ_end: filterDay.frequ_end,
        frequ_type: filterDay.frequ_type,
        is_only_entry4day: filterDay.is_only_entry4day,
      } as EventFrequ;
      if (addDay.addInfo?.length) {
        addDay.addInfo.push(addInfo);
      } else {
        addDay.addInfo = [addInfo];
      }
    }
  }
}
