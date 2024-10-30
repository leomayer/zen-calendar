import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalConfigComponent } from './cal-config.component';

describe('CalConfigComponent', () => {
  let component: CalConfigComponent;
  let fixture: ComponentFixture<CalConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalConfigComponent],
    });
    fixture = TestBed.createComponent(CalConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
