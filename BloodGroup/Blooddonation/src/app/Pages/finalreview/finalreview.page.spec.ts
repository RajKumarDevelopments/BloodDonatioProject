import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalreviewPage } from './finalreview.page';

describe('FinalreviewPage', () => {
  let component: FinalreviewPage;
  let fixture: ComponentFixture<FinalreviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
