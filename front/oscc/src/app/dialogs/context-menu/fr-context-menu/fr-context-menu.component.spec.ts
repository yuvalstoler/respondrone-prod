import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrContextMenuComponent } from './fr-context-menu.component';

describe('FrContextMenuComponent', () => {
  let component: FrContextMenuComponent;
  let fixture: ComponentFixture<FrContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrContextMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
