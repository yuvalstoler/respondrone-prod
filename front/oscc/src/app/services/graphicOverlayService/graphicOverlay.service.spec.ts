import { TestBed } from '@angular/core/testing';

import { GraphicOverlayService } from './graphicOverlay.service';

describe('GraphicOverlayService', () => {
  let service: GraphicOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphicOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
