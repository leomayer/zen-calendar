import { TestBed } from '@angular/core/testing';

import { WeekdayDateService } from './weekday-date.service';

describe('WeekdayDateService', () => {
  let service: WeekdayDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeekdayDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
