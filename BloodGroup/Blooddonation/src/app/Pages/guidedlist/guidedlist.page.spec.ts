import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuidedlistPage } from './guidedlist.page';

describe('GuidedlistPage', () => {
  let component: GuidedlistPage;
  let fixture: ComponentFixture<GuidedlistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidedlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
