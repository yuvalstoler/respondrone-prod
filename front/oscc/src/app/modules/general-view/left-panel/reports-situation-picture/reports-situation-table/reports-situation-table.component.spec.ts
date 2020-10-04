import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSituationTableComponent } from './reports-situation-table.component';

describe('ReportsSituationTableComponent', () => {
  let component: ReportsSituationTableComponent;
  let fixture: ComponentFixture<ReportsSituationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsSituationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsSituationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
