import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifControlComponent } from './dif-control.component';

describe('DifControlComponent', () => {
  let component: DifControlComponent;
  let fixture: ComponentFixture<DifControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
