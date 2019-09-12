import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlyTableComponent } from './aly-table.component';

describe('AlyTableComponent', () => {
  let component: AlyTableComponent;
  let fixture: ComponentFixture<AlyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
