import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagetemplatesPage } from './imagetemplates.page';

describe('ImagetemplatesPage', () => {
  let component: ImagetemplatesPage;
  let fixture: ComponentFixture<ImagetemplatesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagetemplatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
