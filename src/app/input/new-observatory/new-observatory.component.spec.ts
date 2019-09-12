import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewObservatoryComponent } from './new-observatory.component';

describe('NewObservatoryComponent', () => {
  let component: NewObservatoryComponent;
  let fixture: ComponentFixture<NewObservatoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewObservatoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewObservatoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
