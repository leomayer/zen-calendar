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

  getEvents(curMonth: Date): CalendarEventShort[] {
    const retList = [] as CalendarEventShort[];
    // get the list from the DB
    const dbList = this.helper.getOverview4Month(curMonth);
    this.setFixedDate(dbList, retList);
    this.setRepeatingWeekDates(dbList, retList, curMonth);
    return retList;
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
        const weekDays = getWeekdaysInMonth(curMonth, filterDay.frequ_day);
        // for each weekday: add the event to the calendar
        weekDays.forEach((weekDay) => {
          let addDay = retList.find((chkMapDay) =>
            areDatesOnSameDay(chkMapDay.start, weekDay),
          );
          if (!addDay) {
            addDay = {
              start: weekDay,
              eventIds: [],
            };
          }
          addDay.eventIds.push(filterDay.id);
          retList.push(addDay);
        });
      });
  }

  /*
  private getMondays(): CalendarEvent {
    return {
      id: 'abc',
      start: {
        date: new Date(),
        time: '18:30',
      },
      end: {
        date: new Date(),
        time: '20:30',
      },
      description: `
<p>PRACTICE ON MONDAY (hybrid): 18:30-20:45<br>
Chanting, 2 x 35′ Zen meditation, Q &amp; A/talk.<br>
Head: ZM Hyon Ja.<br>
Zoom link: <a href="https://bit.ly/Monday-Practice" target="_blank" rel="noopener">https://bit.ly/Monday-Practice</a></p>`,
    };
  }
  private getWednesdays(): CalendarEvent {
    return {
      id: 'abc',
      start: {
        date: new Date(),
        time: '07:00',
      },
      end: {
        date: new Date(),
        time: '08:15',
      },
      description: `
<p>WEDNESDAY MORNING ZEN MEDITATION: 07:00-08:10<br>
One hour of early morning Zen meditation.<br>
Head: Leo Welsch, SDT.<br>
The practice will take place at the Zen Center.<br>
(Please register via <a href="mailto:leo_zen@gmx.at" target="_blank" rel="noopener" class="mail-link" data-wpel-link="ignore"><span class="wpmt wpml-rtl"><span class="wpml-sd">ta.xm</span><span class="wpml-nodis">1698600878</span><span class="wpml-sd">g@nez</span><span class="wpml-nodis">1698600878</span><span class="wpml-sd">_oel</span><span class="wpml-nodis">1698600878</span></span></a>.)</p>  `,
    };
  }
  */
}
