import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirResourcesComponent } from './air-resources.component';

describe('AirResourcesComponent', () => {
  let component: AirResourcesComponent;
  let fixture: ComponentFixture<AirResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
