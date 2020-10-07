import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedReportDialogComponent } from './linked-report-dialog.component';

describe('LinkedReportDialogComponent', () => {
  let component: LinkedReportDialogComponent;
  let fixture: ComponentFixture<LinkedReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedReportDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
