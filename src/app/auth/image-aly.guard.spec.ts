import { TestBed, async, inject } from '@angular/core/testing';

import { ImageAlyGuard } from './image-aly.guard';

describe('ImageAlyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageAlyGuard]
    });
  });

  it('should ...', inject([ImageAlyGuard], (guard: ImageAlyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
