import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalStatusComponent } from './cal-status.component';

describe('CalStatusComponent', () => {
  let component: CalStatusComponent;
  let fixture: ComponentFixture<CalStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
