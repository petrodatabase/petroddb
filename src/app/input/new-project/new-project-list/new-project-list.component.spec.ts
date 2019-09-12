import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectListComponent } from './new-project-list.component';

describe('NewProjectListComponent', () => {
  let component: NewProjectListComponent;
  let fixture: ComponentFixture<NewProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
