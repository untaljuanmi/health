import { HealthEvent, HealthEventTypeEnum } from '../health-event/health-event.model';

export interface MonthCalendarDayInterface {
  date: Date | null;
  day: number | null;
  eventCount: number;
  isToday: boolean;
}

export function getHealthEventDate(healthEvent: HealthEvent): Date | null {
  return (healthEvent.type === HealthEventTypeEnum.Pain ? healthEvent.from : healthEvent.date) ?? null;
}

export function buildMonthCalendarDays(healthEvents: HealthEvent[], currentDate: Date): MonthCalendarDayInterface[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;
  const totalCalendarDays = Math.ceil((leadingEmptyDays + daysInMonth) / 7) * 7;
  const eventCountByDay = new Map<number, number>();

  healthEvents.forEach((healthEvent: HealthEvent) => {
    const date = getHealthEventDate(healthEvent);

    if (!date || date.getFullYear() !== year || date.getMonth() !== month) {
      return;
    }

    if (healthEvent.type === HealthEventTypeEnum.Drug) {
      return;
    }

    const day = date.getDate();
    eventCountByDay.set(day, (eventCountByDay.get(day) ?? 0) + 1);
  });

  return Array.from({ length: totalCalendarDays }, (_, index: number): MonthCalendarDayInterface => {
    const day = index - leadingEmptyDays + 1;

    if (day < 1 || day > daysInMonth) {
      return { date: null, day: null, eventCount: 0, isToday: false };
    }

    return {
      date: new Date(year, month, day),
      day,
      eventCount: eventCountByDay.get(day) ?? 0,
      isToday: day === currentDate.getDate(),
    };
  });
}
