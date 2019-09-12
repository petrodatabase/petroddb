import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifTableComponent } from './dif-table.component';

describe('DifTableComponent', () => {
  let component: DifTableComponent;
  let fixture: ComponentFixture<DifTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
