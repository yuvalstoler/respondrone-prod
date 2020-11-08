import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionDialogComponent } from './mission-dialog.component';

describe('MissionDialogComponent', () => {
  let component: MissionDialogComponent;
  let fixture: ComponentFixture<MissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
