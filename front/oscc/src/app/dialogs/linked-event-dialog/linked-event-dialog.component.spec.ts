import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedEventDialogComponent } from './linked-event-dialog.component';

describe('LinkedEventDialogComponent', () => {
  let component: LinkedEventDialogComponent;
  let fixture: ComponentFixture<LinkedEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedEventDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
