import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAlyDifComponent } from './image-aly-dif.component';

describe('ImageAlyDifComponent', () => {
  let component: ImageAlyDifComponent;
  let fixture: ComponentFixture<ImageAlyDifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageAlyDifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageAlyDifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
