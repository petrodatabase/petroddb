import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAlyComponent } from './image-aly.component';

describe('ImageAlyComponent', () => {
  let component: ImageAlyComponent;
  let fixture: ComponentFixture<ImageAlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageAlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageAlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
