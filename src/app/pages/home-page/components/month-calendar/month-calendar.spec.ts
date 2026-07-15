import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { HealthEvent, HealthEventTypeEnum } from '../../../../shared/models';
import { buildMonthCalendarDays, MonthCalendar } from './month-calendar';

describe('MonthCalendar', () => {
  let component: MonthCalendar;
  let fixture: ComponentFixture<MonthCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthCalendar],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should count the events of each day in the current month', () => {
    const currentDate = new Date(2026, 6, 15);
    const healthEvents = [
      new HealthEvent({ type: HealthEventTypeEnum.Pain, from: new Date(2026, 6, 15) }),
      new HealthEvent({ type: HealthEventTypeEnum.Drug, date: new Date(2026, 6, 15) }),
      new HealthEvent({ type: HealthEventTypeEnum.Drug, date: new Date(2026, 5, 15) }),
    ];

    const days = buildMonthCalendarDays(healthEvents, currentDate);

    expect(days.find((day) => day.day === 15)?.eventCount).toBe(2);
    expect(days.filter((day) => day.day !== null).reduce((total, day) => total + day.eventCount, 0)).toBe(2);
  });

  it('should start the calendar week on Monday', () => {
    const currentDate = new Date(2026, 6, 15);
    const days = buildMonthCalendarDays([], currentDate);
    const expectedLeadingEmptyDays = (new Date(2026, 6, 1).getDay() + 6) % 7;

    expect(days.findIndex((day) => day.day === 1)).toBe(expectedLeadingEmptyDays);
    expect(days.length % 7).toBe(0);
  });
});
