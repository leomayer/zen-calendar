import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalConfigDetailComponent } from './cal-config-detail.component';

describe('CalConfigDetailComponent', () => {
  let component: CalConfigDetailComponent;
  let fixture: ComponentFixture<CalConfigDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalConfigDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalConfigDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
