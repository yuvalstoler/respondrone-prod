import { TestBed } from '@angular/core/testing';

import { LiveVideoService } from './live-video.service';

describe('LiveVideoService', () => {
  let service: LiveVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
