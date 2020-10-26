import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAssigneesContainerComponent } from './task-assignees-container.component';

describe('LinkedReportContainerComponent', () => {
  let component: TaskAssigneesContainerComponent;
  let fixture: ComponentFixture<TaskAssigneesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAssigneesContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAssigneesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
