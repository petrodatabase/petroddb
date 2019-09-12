import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointAlyControlComponent } from './point-aly-control.component';

describe('PointAlyControlComponent', () => {
  let component: PointAlyControlComponent;
  let fixture: ComponentFixture<PointAlyControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointAlyControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointAlyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
