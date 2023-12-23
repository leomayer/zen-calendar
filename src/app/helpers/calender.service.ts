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
      .filter((chk) => chk.frequType === 0)
      .forEach((filterDay) => {
        // since its a one day only event ==> StartDate equals EndDate
        this.addDay2List(filterDay.eventStartDate, retList, filterDay);
      });
  }

  setRepeatingWeekDates(
    dbList: CalendarEvent[],
    retList: CalendarEventShort[],
    curMonth: Date,
  ) {
    const useFrequType = 1;
    dbList
      .filter((chk) => chk.frequType === useFrequType)
      .forEach((filterDay) => {
        // get for this weekday all dates in this month
        const weekDays = getWeekdaysInMonth(
          curMonth,
          filterDay.eventStartDate.getDay(),
        )
          // filter only those days which are BEFORE the end!!!
          .filter((chkDay) =>
            this.isDateWithinFilterDayInterval(filterDay, chkDay),
          );
        // for each weekday: add the event to the calendar
        weekDays.forEach((weekDay) => {
          this.addDay2List(weekDay, retList, filterDay);
        });
      });
  }
  addDay2List(
    weekDay: Date,
    retList: CalendarEventShort[],
    filterDay: CalendarEvent,
  ) {
    let addDay = retList.find((chkMapDay) =>
      areDatesOnSameDay(chkMapDay.start, weekDay),
    );
    if (addDay) {
      addDay.eventIds.push(filterDay.id);
      this.appendAddInfo(filterDay, addDay);
    } else {
      const tmpDay = { ...filterDay };
      tmpDay.eventStartDate = weekDay;
      addDay = this.createShortEvent(tmpDay);
      retList.push(addDay);
    }
    this.setOnlyEventInfo(filterDay, addDay);
  }
  setOnlyEventInfo(filterDay: CalendarEvent, addDay: CalendarEventShort) {
    if (
      filterDay.isOnlyEntry4Day &&
      this.isDateWithinFilterDayInterval(filterDay, addDay.start)
    ) {
      addDay.onlyEventId4Day = filterDay.id;
    }
  }
  isDateWithinFilterDayInterval(filterDay: CalendarEvent, checkDay: Date) {
    return (
      (filterDay.eventStartDate < checkDay ||
        areDatesOnSameDay(filterDay.eventStartDate, checkDay)) &&
      (checkDay < filterDay.eventEndDate ||
        areDatesOnSameDay(filterDay.eventEndDate, checkDay))
    );
  }

  createShortEvent(filterDay: CalendarEvent) {
    const addDay: CalendarEventShort = {
      start: filterDay.eventStartDate,
      eventIds: [filterDay.id],
    };
    this.appendAddInfo(filterDay, addDay);
    return addDay;
  }

  appendAddInfo(filterDay: CalendarEvent, addDay: CalendarEventShort) {
    if (this.useConfigInterface) {
      const addInfo = {
        frequ_id: filterDay.id,
        eventStartDate: filterDay.eventStartDate,
        eventEndDate: filterDay.eventEndDate,
        frequType: filterDay.frequType,
        isOnlyEntry4Day: filterDay.isOnlyEntry4Day,
      } as EventFrequ;
      if (addDay.addInfo?.length) {
        addDay.addInfo.push(addInfo);
      } else {
        addDay.addInfo = [addInfo];
      }
    }
  }
}
