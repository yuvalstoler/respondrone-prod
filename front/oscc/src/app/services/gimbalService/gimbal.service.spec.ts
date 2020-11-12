import { TestBed } from '@angular/core/testing';

import { GimbalService } from './airVehicle.service';

describe('AirVehicleService', () => {
  let service: GimbalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GimbalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
