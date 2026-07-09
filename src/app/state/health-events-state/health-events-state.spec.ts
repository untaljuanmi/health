import { TestBed } from '@angular/core/testing';

import { HealthEventsState } from './health-events-state';

describe('HealthEventsState', () => {
  let service: HealthEventsState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthEventsState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
