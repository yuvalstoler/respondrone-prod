import { TestBed } from '@angular/core/testing';

import { MissionRouteService } from './missionRoute.service';

describe('MissionRouteService', () => {
  let service: MissionRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
