import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CalSaveService } from './cal-save.service';

@Component({
  selector: 'app-cal-save-config',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './cal-save-config.component.html',
  styleUrl: './cal-save-config.component.scss',
})
export class CalSaveConfigComponent {
  readonly calendarSave = inject(CalSaveService);

  saveChanges() {
    this.calendarSave.saveChanges();
  }
}
