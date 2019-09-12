import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVolcanoListComponent } from './new-volcano-list.component';

describe('NewVolcanoListComponent', () => {
  let component: NewVolcanoListComponent;
  let fixture: ComponentFixture<NewVolcanoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVolcanoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVolcanoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
