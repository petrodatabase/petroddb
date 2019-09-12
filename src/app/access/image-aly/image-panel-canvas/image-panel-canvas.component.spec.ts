import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePanelCanvasComponent } from './image-panel-canvas.component';

describe('ImagePanelCanvasComponent', () => {
  let component: ImagePanelCanvasComponent;
  let fixture: ComponentFixture<ImagePanelCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagePanelCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePanelCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
