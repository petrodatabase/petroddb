import { TestBed, inject } from '@angular/core/testing';

import { SampleExcelReaderService } from './sample-excel-reader.service';

describe('SampleExcelReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SampleExcelReaderService]
    });
  });

  it('should be created', inject([SampleExcelReaderService], (service: SampleExcelReaderService) => {
    expect(service).toBeTruthy();
  }));
});
