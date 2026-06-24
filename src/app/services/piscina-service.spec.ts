import { TestBed } from '@angular/core/testing';

import { PiscinaService } from './piscina-service';

describe('PiscinaService', () => {
  let service: PiscinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PiscinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
