import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { CalBasicComponent } from '../cal-basic/cal-basic.component';

@Component({
    selector: 'app-cal-short-code',
    templateUrl: './cal-short-code.component.html',
    styleUrls: ['./cal-short-code.component.scss'],
    imports: [MatCard, CalBasicComponent]
})
export class CalShortCodeComponent {}
