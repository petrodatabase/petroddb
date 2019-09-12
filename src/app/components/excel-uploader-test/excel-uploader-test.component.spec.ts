import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelUploaderTestComponent } from './excel-uploader-test.component';

describe('ExcelUploaderTestComponent', () => {
  let component: ExcelUploaderTestComponent;
  let fixture: ComponentFixture<ExcelUploaderTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelUploaderTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelUploaderTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
