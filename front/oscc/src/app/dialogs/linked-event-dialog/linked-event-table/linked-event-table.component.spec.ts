import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedEventTableComponent } from './linked-event-table.component';

describe('LinkedEventTableComponent', () => {
  let component: LinkedEventTableComponent;
  let fixture: ComponentFixture<LinkedEventTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedEventTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedEventTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
