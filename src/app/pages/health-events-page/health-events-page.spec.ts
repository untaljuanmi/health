import { ComponentFixture, TestBed } from '@angular/core/testing';

import HealthEventsPage from './health-events-page';

describe('HealthEventsPage', () => {
  let component: HealthEventsPage;
  let fixture: ComponentFixture<HealthEventsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthEventsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthEventsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
