import { TestBed } from '@angular/core/testing';

import { ColorExtractionService } from './color-extraction.service';

describe('ColorExtractionService', () => {
  let service: ColorExtractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorExtractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
