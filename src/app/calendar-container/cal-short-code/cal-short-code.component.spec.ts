import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalShortCodeComponent } from './cal-short-code.component';

describe('CalShortCodeComponent', () => {
  let component: CalShortCodeComponent;
  let fixture: ComponentFixture<CalShortCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalShortCodeComponent],
    });
    fixture = TestBed.createComponent(CalShortCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
