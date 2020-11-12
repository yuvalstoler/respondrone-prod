import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsSituationTableComponent } from './reports-situation-table.component';

describe('ReportsSituationTableComponent', () => {
  let component: MissionsSituationTableComponent;
  let fixture: ComponentFixture<MissionsSituationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionsSituationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionsSituationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
