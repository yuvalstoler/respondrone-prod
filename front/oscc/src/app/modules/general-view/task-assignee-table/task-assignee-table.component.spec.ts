import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAssigneeTableComponent } from './task-assignee-table.component';

describe('TaskAssigneeTableComponent', () => {
  let component: TaskAssigneeTableComponent;
  let fixture: ComponentFixture<TaskAssigneeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAssigneeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAssigneeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
