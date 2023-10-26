import { Component } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';

@Component({
  selector: 'app-cal-short-code',
  templateUrl: './cal-short-code.component.html',
  styleUrls: ['./cal-short-code.component.scss'],
})
export class CalShortCodeComponent {
  constructor(protected store: AppStoreService) {}
}
