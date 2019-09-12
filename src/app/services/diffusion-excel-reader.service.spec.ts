import { TestBed, inject } from '@angular/core/testing';

import { DiffusionExcelReaderService } from './diffusion-excel-reader.service';

describe('DiffusionExcelReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiffusionExcelReaderService]
    });
  });

  it('should be created', inject([DiffusionExcelReaderService], (service: DiffusionExcelReaderService) => {
    expect(service).toBeTruthy();
  }));
});
