import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedToWindowComponent } from './linked-to-window.component';

describe('LinkedToWindowComponent', () => {
  let component: LinkedToWindowComponent;
  let fixture: ComponentFixture<LinkedToWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedToWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedToWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
