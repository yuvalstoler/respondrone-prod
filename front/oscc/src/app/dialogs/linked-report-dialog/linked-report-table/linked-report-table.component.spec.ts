import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedReportTableComponent } from './linked-report-table.component';

describe('LinkedReportTableComponent', () => {
  let component: LinkedReportTableComponent;
  let fixture: ComponentFixture<LinkedReportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedReportTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
