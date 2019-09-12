import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolcanoComponent } from './volcano.component';

describe('VolcanoComponent', () => {
  let component: VolcanoComponent;
  let fixture: ComponentFixture<VolcanoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolcanoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolcanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
