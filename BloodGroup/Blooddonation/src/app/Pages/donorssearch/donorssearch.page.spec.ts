import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonorssearchPage } from './donorssearch.page';

describe('DonorssearchPage', () => {
  let component: DonorssearchPage;
  let fixture: ComponentFixture<DonorssearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorssearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
