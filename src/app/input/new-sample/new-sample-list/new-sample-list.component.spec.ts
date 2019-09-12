import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSampleListComponent } from './new-sample-list.component';

describe('NewSampleListComponent', () => {
  let component: NewSampleListComponent;
  let fixture: ComponentFixture<NewSampleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSampleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSampleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
