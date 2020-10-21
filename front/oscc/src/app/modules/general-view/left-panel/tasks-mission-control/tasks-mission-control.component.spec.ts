import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksMissionControlComponent } from './tasks-mission-control.component';

describe('TasksMissionControlComponent', () => {
  let component: TasksMissionControlComponent;
  let fixture: ComponentFixture<TasksMissionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksMissionControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksMissionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
