import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointAlyChartComponent } from './point-aly-chart.component';

describe('PointAlyChartComponent', () => {
  let component: PointAlyChartComponent;
  let fixture: ComponentFixture<PointAlyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointAlyChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointAlyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
