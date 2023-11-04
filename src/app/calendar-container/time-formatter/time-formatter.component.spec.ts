import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeFormatterComponent } from './time-formatter.component';

describe('TimeFormatterComponent', () => {
  let component: TimeFormatterComponent;
  let fixture: ComponentFixture<TimeFormatterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeFormatterComponent],
    });
    fixture = TestBed.createComponent(TimeFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
