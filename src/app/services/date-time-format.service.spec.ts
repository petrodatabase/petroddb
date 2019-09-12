import { TestBed, inject } from '@angular/core/testing';

import { DateTimeFormatService } from './date-time-format.service';

describe('DateTimeFormatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateTimeFormatService]
    });
  });

  it('should be created', inject([DateTimeFormatService], (service: DateTimeFormatService) => {
    expect(service).toBeTruthy();
  }));
});
