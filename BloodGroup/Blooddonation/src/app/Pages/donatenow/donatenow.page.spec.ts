import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonatenowPage } from './donatenow.page';

describe('DonatenowPage', () => {
  let component: DonatenowPage;
  let fixture: ComponentFixture<DonatenowPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonatenowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
