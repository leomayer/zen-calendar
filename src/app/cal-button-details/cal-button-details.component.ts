import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CalendarStore } from '@app/app-store.service';
import { CalendarEventShort, CalenderInfo } from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-cal-button-details',
  templateUrl: './cal-button-details.component.html',
  styleUrls: ['./cal-button-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalButtonDetailsComponent {
  events = {} as CalendarEventShort;
  readonly calendarStore = inject(CalendarStore);
  openDialog(lang: string) {
    this.calendarStore.patchLang(lang);
    const lstOfEvents: CalenderInfo[] = [];
    const vals = this.calendarStore
      .calConfigDet()
      .map((contr) => contr.getRawValue());
    let hasOnlyOneEvent = false;
    vals.forEach((chk) => {
      const filteredDetails = chk.fields.filter((det) => det.lang === lang);
      filteredDetails.forEach((event4Lang) => {
        if (chk.isOnlyEntry4day) {
          hasOnlyOneEvent = true;
          if (lstOfEvents.length) {
            // remove all other existing events
            lstOfEvents.splice(0, lstOfEvents.length);
          }
        }
        if (!hasOnlyOneEvent || chk.isOnlyEntry4day) {
          const singleEvent = {} as CalenderInfo;
          singleEvent.lang = lang;
          singleEvent.id = chk.id ?? 0;
          singleEvent.eventEndTime = chk.eventEndTime ?? 0;
          singleEvent.eventStartTime = chk.eventStartTime ?? 0;
          singleEvent.title = event4Lang.title ?? '';
          singleEvent.calBasicId = event4Lang.calBasicId ?? 0;
          singleEvent.description = event4Lang.description ?? '';
          singleEvent.link = event4Lang.link ?? '';
          singleEvent.linkTitle = event4Lang.linkTitle ?? '';
          singleEvent.linkType = event4Lang.linkType;
          lstOfEvents.push(singleEvent);
        }
      });
    });
    lstOfEvents.sort((a, b) => a.eventStartTime - b.eventStartTime);
    this.calendarStore.patchEvents(lstOfEvents);
    this.calendarStore.displayDialog(true);
  }
}
