import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAssigneesTableComponent } from './task-assignees-table.component';

describe('LinkedReportTableComponent', () => {
  let component: TaskAssigneesTableComponent;
  let fixture: ComponentFixture<TaskAssigneesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAssigneesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAssigneesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
