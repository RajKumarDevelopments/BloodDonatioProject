import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoincampaignPage } from './joincampaign.page';

describe('JoincampaignPage', () => {
  let component: JoincampaignPage;
  let fixture: ComponentFixture<JoincampaignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JoincampaignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
