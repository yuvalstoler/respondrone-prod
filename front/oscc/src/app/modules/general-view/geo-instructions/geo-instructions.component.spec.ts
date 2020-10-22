import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoInstructionsComponent } from './geo-instructions.component';

describe('GeoInstructionsComponent', () => {
  let component: GeoInstructionsComponent;
  let fixture: ComponentFixture<GeoInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoInstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
