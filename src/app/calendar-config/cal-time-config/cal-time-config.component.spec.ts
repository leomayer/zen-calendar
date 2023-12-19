import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalTimeConfigComponent } from './cal-time-config.component';

describe('CalTimeConfigComponent', () => {
  let component: CalTimeConfigComponent;
  let fixture: ComponentFixture<CalTimeConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalTimeConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalTimeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
