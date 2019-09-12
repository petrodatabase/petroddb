import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleFileListComponent } from './sample-file-list.component';

describe('SampleFileListComponent', () => {
  let component: SampleFileListComponent;
  let fixture: ComponentFixture<SampleFileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleFileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
