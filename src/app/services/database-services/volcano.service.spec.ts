import { TestBed, inject } from '@angular/core/testing';

import { VolcanoService } from './volcano.service';

describe('VolcanoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VolcanoService]
    });
  });

  it('should be created', inject([VolcanoService], (service: VolcanoService) => {
    expect(service).toBeTruthy();
  }));
});
