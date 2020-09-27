import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSituationPictureComponent } from './events-situation-picture.component';

describe('EventsSituationPictureComponent', () => {
  let component: EventsSituationPictureComponent;
  let fixture: ComponentFixture<EventsSituationPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsSituationPictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsSituationPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
