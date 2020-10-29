import { TestBed } from '@angular/core/testing';

import { ListenerMapService } from './listener-map.service';

describe('ListenerMapService', () => {
  let service: ListenerMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListenerMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
