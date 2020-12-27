import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverTextDialogComponent } from './hover-text-dialog.component';

describe('HoverTextDialogComponent', () => {
  let component: HoverTextDialogComponent;
  let fixture: ComponentFixture<HoverTextDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoverTextDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverTextDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
