import { TestBed } from '@angular/core/testing';

import { MissionRequestService } from './missionRequest.service';

describe('MissionRequestService', () => {
  let service: MissionRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
