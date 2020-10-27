import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAssigneesDialogComponent } from './task-assignees-dialog.component';

describe('LinkedReportDialogComponent', () => {
  let component: TaskAssigneesDialogComponent;
  let fixture: ComponentFixture<TaskAssigneesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAssigneesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAssigneesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
