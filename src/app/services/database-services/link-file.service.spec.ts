import { TestBed, inject } from '@angular/core/testing';

import { LinkFileService } from './link-file.service';

describe('LinkFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinkFileService]
    });
  });

  it('should be created', inject([LinkFileService], (service: LinkFileService) => {
    expect(service).toBeTruthy();
  }));
});
