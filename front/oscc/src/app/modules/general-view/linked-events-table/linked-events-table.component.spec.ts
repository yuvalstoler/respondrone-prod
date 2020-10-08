import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedEventsTableComponent } from './linked-events-table.component';

describe('LinkedEventsTableComponent', () => {
  let component: LinkedEventsTableComponent;
  let fixture: ComponentFixture<LinkedEventsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedEventsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedEventsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
