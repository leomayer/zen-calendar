import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-formatter',
  templateUrl: './time-formatter.component.html',
  styleUrls: ['./time-formatter.component.scss'],
})
export class TimeFormatterComponent {
  @Input({ required: true }) startTime!: number | undefined;
  @Input({ required: true }) endTime!: number | undefined;
}
