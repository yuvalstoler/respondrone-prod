import { TestBed } from '@angular/core/testing';

import { MapGeneralService } from './map-general.service';

describe('MapGeneralService', () => {
  let service: MapGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
