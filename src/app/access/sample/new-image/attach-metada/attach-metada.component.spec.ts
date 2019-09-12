import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachMetadaComponent } from './attach-metada.component';

describe('AttachMetadaComponent', () => {
  let component: AttachMetadaComponent;
  let fixture: ComponentFixture<AttachMetadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachMetadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachMetadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
