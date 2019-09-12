import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagioclaseDialogComponent } from './plagioclase-dialog.component';

describe('PlagioclaseDialogComponent', () => {
  let component: PlagioclaseDialogComponent;
  let fixture: ComponentFixture<PlagioclaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlagioclaseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlagioclaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
