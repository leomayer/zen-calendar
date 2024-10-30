import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalBasicComponent } from './cal-basic.component';

describe('CalBasicComponent', () => {
  let component: CalBasicComponent;
  let fixture: ComponentFixture<CalBasicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalBasicComponent],
    });
    fixture = TestBed.createComponent(CalBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
