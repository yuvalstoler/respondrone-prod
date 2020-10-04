import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedReportsTableComponent } from './linked-reports-table.component';

describe('LinkedReportsTableComponent', () => {
  let component: LinkedReportsTableComponent;
  let fixture: ComponentFixture<LinkedReportsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedReportsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedReportsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
