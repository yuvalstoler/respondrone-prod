import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSituationTableComponent } from './events-situation-table.component';

describe('EventsSituationTableComponent', () => {
  let component: EventsSituationTableComponent;
  let fixture: ComponentFixture<EventsSituationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsSituationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsSituationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
