import { TestBed, inject } from '@angular/core/testing';

import { PointAlyExcelReaderService } from './point-aly-excel-reader.service';

describe('PointAlyExcelReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PointAlyExcelReaderService]
    });
  });

  it('should be created', inject([PointAlyExcelReaderService], (service: PointAlyExcelReaderService) => {
    expect(service).toBeTruthy();
  }));
});
