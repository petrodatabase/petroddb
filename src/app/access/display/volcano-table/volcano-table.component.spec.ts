import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolcanoTableComponent } from './volcano-table.component';

describe('VolcanoTableComponent', () => {
  let component: VolcanoTableComponent;
  let fixture: ComponentFixture<VolcanoTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolcanoTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolcanoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
