import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthEventCard } from './health-event-card';

describe('DrugCard', () => {
  let component: HealthEventCard;
  let fixture: ComponentFixture<HealthEventCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthEventCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthEventCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
