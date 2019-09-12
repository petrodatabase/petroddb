import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReferenceComponent } from './new-reference.component';

describe('NewReferenceComponent', () => {
  let component: NewReferenceComponent;
  let fixture: ComponentFixture<NewReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
