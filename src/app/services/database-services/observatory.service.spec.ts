import { TestBed, inject } from '@angular/core/testing';

import { ObservatoryService } from './observatory.service';

describe('ObservatoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObservatoryService]
    });
  });

  it('should be created', inject([ObservatoryService], (service: ObservatoryService) => {
    expect(service).toBeTruthy();
  }));
});
