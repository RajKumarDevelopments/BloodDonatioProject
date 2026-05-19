import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderguidePage } from './leaderguide.page';

describe('LeaderguidePage', () => {
  let component: LeaderguidePage;
  let fixture: ComponentFixture<LeaderguidePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderguidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
