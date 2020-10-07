import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedReportContainerComponent } from './linked-report-container.component';

describe('LinkedReportContainerComponent', () => {
  let component: LinkedReportContainerComponent;
  let fixture: ComponentFixture<LinkedReportContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedReportContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedReportContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
