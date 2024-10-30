import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalButtonDetailsComponent } from './cal-button-details.component';

describe('CalButtonDetailsComponent', () => {
  let component: CalButtonDetailsComponent;
  let fixture: ComponentFixture<CalButtonDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalButtonDetailsComponent],
    });
    fixture = TestBed.createComponent(CalButtonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
