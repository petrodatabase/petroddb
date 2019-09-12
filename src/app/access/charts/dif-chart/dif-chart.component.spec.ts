import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifChartComponent } from './dif-chart.component';

describe('DifChartComponent', () => {
  let component: DifChartComponent;
  let fixture: ComponentFixture<DifChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
