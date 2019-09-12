import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationTableComponent } from './publication-table.component';

describe('PublicationTableComponent', () => {
  let component: PublicationTableComponent;
  let fixture: ComponentFixture<PublicationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
