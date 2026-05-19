import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadbrochersPage } from './downloadbrochers.page';

describe('DownloadbrochersPage', () => {
  let component: DownloadbrochersPage;
  let fixture: ComponentFixture<DownloadbrochersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadbrochersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
