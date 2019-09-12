import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifChartDialogComponent } from './dif-chart-dialog.component';

describe('DifChartDialogComponent', () => {
  let component: DifChartDialogComponent;
  let fixture: ComponentFixture<DifChartDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifChartDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifChartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
