import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakelinkDialogComponent } from './makelink-dialog.component';

describe('MakelinkDialogComponent', () => {
  let component: MakelinkDialogComponent;
  let fixture: ComponentFixture<MakelinkDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakelinkDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakelinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
