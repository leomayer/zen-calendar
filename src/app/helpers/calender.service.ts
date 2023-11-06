import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventShort } from './calenderTypes';
import { CalendarTestHelper } from './calender.test-helper.service';
import {
  areDatesOnSameDay,
  getWeekdaysInMonth,
} from './calendar.functions.helper';

@Injectable({
  providedIn: 'root',
})
export class CalenderService {
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

  async getEventsByIds(eventIds: number[]) {
    return await this.helper.getEventsByIds(
      eventIds,
      document.documentElement.lang,
    );
  }

  // filter all those events which are not repeating
  setFixedDate(dbList: CalendarEvent[], retList: CalendarEventShort[]) {
    dbList
      .filter((chk) => chk.frequ_type === 0)
      .forEach((filterDay) => {
        const addDay: CalendarEventShort = {
          start: filterDay.event_start,
          eventIds: [filterDay.id],
        };
        retList.push(addDay);
      });
  }
  setRepeatingWeekDates(
    dbList: CalendarEvent[],
    retList: CalendarEventShort[],
    curMonth: Date,
  ) {
    dbList
      .filter((chk) => chk.frequ_type === 1)
      .forEach((filterDay) => {
        // get for this weekday all dates in this month
        const weekDays = getWeekdaysInMonth(
          curMonth,
          filterDay.frequ_start.getDay(),
        );
        // for each weekday: add the event to the calendar
        weekDays.forEach((weekDay) => {
          let addDay = retList.find((chkMapDay) =>
            areDatesOnSameDay(chkMapDay.start, weekDay),
          );
          if (addDay) {
            addDay.eventIds.push(filterDay.id);
          } else {
            addDay = {
              start: weekDay,
              eventIds: [filterDay.id],
            };
            retList.push(addDay);
          }
        });
      });
  }
}
