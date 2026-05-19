import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharevideoPage } from './sharevideo.page';

describe('SharevideoPage', () => {
  let component: SharevideoPage;
  let fixture: ComponentFixture<SharevideoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SharevideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
