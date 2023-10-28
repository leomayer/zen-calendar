import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalMonthHeaderComponent } from './cal-month-header.component';

describe('CalMonthHeaderComponent', () => {
  let component: CalMonthHeaderComponent;
  let fixture: ComponentFixture<CalMonthHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalMonthHeaderComponent],
    });
    fixture = TestBed.createComponent(CalMonthHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
