import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundResourcesComponent } from './ground-resources.component';

describe('GroundResourcesComponent', () => {
  let component: GroundResourcesComponent;
  let fixture: ComponentFixture<GroundResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroundResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroundResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
