import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftNarrowPanelComponent } from './left-narrow-panel.component';

describe('LeftNarrowPanelComponent', () => {
  let component: LeftNarrowPanelComponent;
  let fixture: ComponentFixture<LeftNarrowPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftNarrowPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftNarrowPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
