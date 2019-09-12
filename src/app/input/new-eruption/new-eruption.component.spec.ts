import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEruptionComponent } from './new-eruption.component';

describe('NewEruptionComponent', () => {
  let component: NewEruptionComponent;
  let fixture: ComponentFixture<NewEruptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEruptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEruptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
