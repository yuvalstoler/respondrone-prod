import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsMissionControlComponent } from './missions-mission-control.component';

describe('MissionsMissionControlComponent', () => {
  let component: MissionsMissionControlComponent;
  let fixture: ComponentFixture<MissionsMissionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionsMissionControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionsMissionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
