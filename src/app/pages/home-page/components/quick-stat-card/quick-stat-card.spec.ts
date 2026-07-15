import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickStatCard } from './quick-stat-card';

describe('QuickStatCard', () => {
  let component: QuickStatCard;
  let fixture: ComponentFixture<QuickStatCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickStatCard],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickStatCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
