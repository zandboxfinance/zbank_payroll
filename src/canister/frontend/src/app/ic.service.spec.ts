import { TestBed } from '@angular/core/testing';

import { IcService } from './ic.service';

describe('IcService', () => {
  let service: IcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
