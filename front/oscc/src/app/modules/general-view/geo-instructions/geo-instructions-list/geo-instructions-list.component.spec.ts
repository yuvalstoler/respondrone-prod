import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoInstructionsListComponent } from './geo-instructions-list.component';

describe('GeoInstructionsListComponent', () => {
  let component: GeoInstructionsListComponent;
  let fixture: ComponentFixture<GeoInstructionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoInstructionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoInstructionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
