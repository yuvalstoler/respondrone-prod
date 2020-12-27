import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorPositionComponent } from './cursor-position.component';

describe('CursorPositionComponent', () => {
  let component: CursorPositionComponent;
  let fixture: ComponentFixture<CursorPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CursorPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CursorPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
