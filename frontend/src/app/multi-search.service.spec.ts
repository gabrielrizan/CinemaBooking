import { TestBed } from '@angular/core/testing';

import { MultiSearchService } from './multi-search.service';

describe('MultiSearchService', () => {
  let service: MultiSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
