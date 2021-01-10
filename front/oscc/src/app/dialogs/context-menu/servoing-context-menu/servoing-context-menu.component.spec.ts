import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServoingContextMenuComponent } from './servoing-context-menu.component';

describe('ServoingContextMenuComponent', () => {
  let component: ServoingContextMenuComponent;
  let fixture: ComponentFixture<ServoingContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServoingContextMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServoingContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
