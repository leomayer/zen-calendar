import { Component, Input } from '@angular/core';
import { Minutes2HourMinPipe } from '../../helpers/minutes2-hour-min.pipe';

@Component({
    selector: 'app-time-formatter',
    templateUrl: './time-formatter.component.html',
    styleUrls: ['./time-formatter.component.scss'],
    imports: [Minutes2HourMinPipe]
})
export class TimeFormatterComponent {
  @Input({ required: true }) eventStartTime!: number | undefined;
  @Input({ required: true }) eventEndTime!: number | undefined;
}
