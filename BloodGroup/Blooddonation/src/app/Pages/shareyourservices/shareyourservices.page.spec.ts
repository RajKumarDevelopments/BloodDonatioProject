import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareyourservicesPage } from './shareyourservices.page';

describe('ShareyourservicesPage', () => {
  let component: ShareyourservicesPage;
  let fixture: ComponentFixture<ShareyourservicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareyourservicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
