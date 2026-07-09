import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugCard } from './drug-card';

describe('DrugCard', () => {
  let component: DrugCard;
  let fixture: ComponentFixture<DrugCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
