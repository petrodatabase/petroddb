import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVolcanoComponent } from './new-volcano.component';

describe('NewVolcanoComponent', () => {
  let component: NewVolcanoComponent;
  let fixture: ComponentFixture<NewVolcanoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVolcanoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVolcanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
