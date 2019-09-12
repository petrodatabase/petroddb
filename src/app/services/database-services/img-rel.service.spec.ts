import { TestBed, inject } from '@angular/core/testing';

import { ImgRelService } from './img-rel.service';

describe('ImgRelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImgRelService]
    });
  });

  it('should be created', inject([ImgRelService], (service: ImgRelService) => {
    expect(service).toBeTruthy();
  }));
});
