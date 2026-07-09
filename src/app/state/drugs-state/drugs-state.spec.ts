import { TestBed } from '@angular/core/testing';

import { DrugsState } from './drugs-state';

describe('DrugsState', () => {
  let service: DrugsState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrugsState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
