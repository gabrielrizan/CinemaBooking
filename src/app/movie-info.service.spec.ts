import { TestBed } from '@angular/core/testing';

import { MovieInfoService } from './movie-info.service';

describe('MovieInfoService', () => {
  let service: MovieInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
