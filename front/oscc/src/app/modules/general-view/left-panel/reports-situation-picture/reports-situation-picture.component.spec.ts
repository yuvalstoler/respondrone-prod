import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSituationPictureComponent } from './reports-situation-picture.component';

describe('ReportsSituationPictureComponent', () => {
  let component: ReportsSituationPictureComponent;
  let fixture: ComponentFixture<ReportsSituationPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsSituationPictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsSituationPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
