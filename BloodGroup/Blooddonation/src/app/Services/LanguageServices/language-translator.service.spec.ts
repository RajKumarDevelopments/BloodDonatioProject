import { TestBed } from '@angular/core/testing';

import { LanguageTranslatorService } from './language-translator.service';

describe('LanguageTranslatorService', () => {
  let service: LanguageTranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageTranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
