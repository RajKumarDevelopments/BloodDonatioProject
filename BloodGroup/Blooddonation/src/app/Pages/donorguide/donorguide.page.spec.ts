import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonorguidePage } from './donorguide.page';

describe('DonorguidePage', () => {
  let component: DonorguidePage;
  let fixture: ComponentFixture<DonorguidePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorguidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
