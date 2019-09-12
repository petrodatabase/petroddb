import { TestBed, inject } from '@angular/core/testing';

import { ExcelReaderService } from './excel-reader.service';

describe('ExcelReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExcelReaderService]
    });
  });

  it('should be created', inject([ExcelReaderService], (service: ExcelReaderService) => {
    expect(service).toBeTruthy();
  }));
});
