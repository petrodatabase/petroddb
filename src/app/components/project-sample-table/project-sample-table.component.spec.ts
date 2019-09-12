import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSampleTableComponent } from './project-sample-table.component';

describe('ProjectSampleTableComponent', () => {
  let component: ProjectSampleTableComponent;
  let fixture: ComponentFixture<ProjectSampleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSampleTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSampleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
