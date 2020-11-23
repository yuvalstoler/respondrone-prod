import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionUavDialogComponent } from './mission-uav-dialog.component';

describe('MissionUavDialogComponent', () => {
  let component: MissionUavDialogComponent;
  let fixture: ComponentFixture<MissionUavDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionUavDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionUavDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
