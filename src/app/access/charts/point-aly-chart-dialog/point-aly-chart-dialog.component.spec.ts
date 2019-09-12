import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointAlyChartDialogComponent } from './point-aly-chart-dialog.component';

describe('PointAlyChartDialogComponent', () => {
  let component: PointAlyChartDialogComponent;
  let fixture: ComponentFixture<PointAlyChartDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointAlyChartDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointAlyChartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
