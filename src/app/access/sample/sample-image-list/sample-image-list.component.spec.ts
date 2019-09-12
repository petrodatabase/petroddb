import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleImageListComponent } from './sample-image-list.component';

describe('SampleImageListComponent', () => {
  let component: SampleImageListComponent;
  let fixture: ComponentFixture<SampleImageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleImageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleImageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
