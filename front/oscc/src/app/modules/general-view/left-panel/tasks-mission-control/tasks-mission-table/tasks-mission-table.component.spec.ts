import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksMissionTableComponent } from './tasks-mission-table.component';

describe('TasksMissionTableComponent', () => {
  let component: TasksMissionTableComponent;
  let fixture: ComponentFixture<TasksMissionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksMissionTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksMissionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
