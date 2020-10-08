import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedEventContainerComponent } from './linked-event-container.component';

describe('LinkedEventContainerComponent', () => {
  let component: LinkedEventContainerComponent;
  let fixture: ComponentFixture<LinkedEventContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedEventContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedEventContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
