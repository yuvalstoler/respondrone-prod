import { TestBed } from '@angular/core/testing';

import { GeoInstructionsService } from './geo-instructions.service';

describe('GeoInstructionsService', () => {
  let service: GeoInstructionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoInstructionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
