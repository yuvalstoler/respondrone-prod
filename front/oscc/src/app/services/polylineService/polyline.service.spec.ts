import { TestBed } from '@angular/core/testing';

import { PolylineService } from './polyline.service';

describe('PolylineService', () => {
  let service: PolylineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolylineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
