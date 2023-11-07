import { Component, Input } from '@angular/core';
import { CalenderInfo } from '@app/helpers/calenderTypes';

@Component({
  selector: 'app-link-details',
  templateUrl: './link-details.component.html',
  styleUrls: ['./link-details.component.scss'],
})
export class LinkDetailsComponent {
  @Input({ required: true }) curEvent!: CalenderInfo;
}
