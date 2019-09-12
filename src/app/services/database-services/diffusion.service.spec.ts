import { TestBed, inject } from '@angular/core/testing';

import { DiffusionService } from './diffusion.service';

describe('DiffusionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiffusionService]
    });
  });

  it('should be created', inject([DiffusionService], (service: DiffusionService) => {
    expect(service).toBeTruthy();
  }));
});
