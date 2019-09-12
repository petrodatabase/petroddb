import { TestBed, async, inject } from '@angular/core/testing';

import { SampleGuard } from './sample.guard';

describe('SampleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SampleGuard]
    });
  });

  it('should ...', inject([SampleGuard], (guard: SampleGuard) => {
    expect(guard).toBeTruthy();
  }));
});
