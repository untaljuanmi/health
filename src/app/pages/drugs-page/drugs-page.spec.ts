import { ComponentFixture, TestBed } from '@angular/core/testing';

import DrugsPage from './drugs-page';

describe('DrugsPage', () => {
  let component: DrugsPage;
  let fixture: ComponentFixture<DrugsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
