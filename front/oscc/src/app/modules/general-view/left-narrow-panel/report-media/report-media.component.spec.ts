import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMediaComponent } from './report-media.component';

describe('ReportMediaComponent', () => {
  let component: ReportMediaComponent;
  let fixture: ComponentFixture<ReportMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
