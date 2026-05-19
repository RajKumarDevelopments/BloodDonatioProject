import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeedbloodPage } from './needblood.page';

describe('NeedbloodPage', () => {
  let component: NeedbloodPage;
  let fixture: ComponentFixture<NeedbloodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedbloodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
