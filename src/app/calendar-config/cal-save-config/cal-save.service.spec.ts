import { TestBed } from '@angular/core/testing';

import { CalSaveService } from './cal-save.service';

describe('CalSaveService', () => {
  let service: CalSaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalSaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
