import { TestBed, inject } from '@angular/core/testing';

import { EruptionService } from './eruption.service';

describe('EruptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EruptionService]
    });
  });

  it('should be created', inject([EruptionService], (service: EruptionService) => {
    expect(service).toBeTruthy();
  }));
});
