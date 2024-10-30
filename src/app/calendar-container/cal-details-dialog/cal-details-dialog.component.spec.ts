import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalDetailsDialogComponent } from './cal-details-dialog.component';

describe('CalDetailsDialogComponent', () => {
  let component: CalDetailsDialogComponent;
  let fixture: ComponentFixture<CalDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalDetailsDialogComponent],
    });
    fixture = TestBed.createComponent(CalDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
