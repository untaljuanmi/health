import { HealthEvent, HealthEventTypeEnum } from '../../../shared/models';

export type HomePagePeriod = keyof HomePageStateInterface;

export interface HealthEventSummaryInterface {
  drug: number;
  pain: number;
  painLevel: number;
  painAverage: number;
}

export interface HomePageStateInterface {
  today: HealthEventSummaryInterface;
  yesterday: HealthEventSummaryInterface;
  thisWeek: HealthEventSummaryInterface;
  lastWeek: HealthEventSummaryInterface;
  thisMonth: HealthEventSummaryInterface;
  lastMonth: HealthEventSummaryInterface;
  thisYear: HealthEventSummaryInterface;
  lastYear: HealthEventSummaryInterface;
}

export interface DateRangeInterface {
  from: Date;
  to: Date;
}

export function createSummary(): HealthEventSummaryInterface {
  return { drug: 0, pain: 0, painLevel: 0, painAverage: 0 };
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfWeek(date: Date): Date {
  const result = startOfDay(date);
  const daysSinceMonday = (result.getDay() + 6) % 7;
  return addDays(result, -daysSinceMonday);
}

export function buildDateRanges(now: Date): Record<HomePagePeriod, DateRangeInterface> {
  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);

  const thisWeek = startOfWeek(now);
  const nextWeek = addDays(thisWeek, 7);
  const lastWeek = addDays(thisWeek, -7);

  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisYear = new Date(now.getFullYear(), 0, 1);
  const nextYear = new Date(now.getFullYear() + 1, 0, 1);
  const lastYear = new Date(now.getFullYear() - 1, 0, 1);

  return {
    today: { from: today, to: tomorrow },
    yesterday: { from: yesterday, to: today },
    thisWeek: { from: thisWeek, to: nextWeek },
    lastWeek: { from: lastWeek, to: thisWeek },
    thisMonth: { from: thisMonth, to: nextMonth },
    lastMonth: { from: lastMonth, to: thisMonth },
    thisYear: { from: thisYear, to: nextYear },
    lastYear: { from: lastYear, to: thisYear },
  };
}

export function isDateInRange(date: Date, range: DateRangeInterface): boolean {
  return date >= range.from && date < range.to;
}

export function addHealthEventToSummary(summary: HealthEventSummaryInterface, healthEvent: HealthEvent): void {
  if (healthEvent.type === HealthEventTypeEnum.Drug) {
    summary.drug += 1;
    return;
  }

  if (healthEvent.type === HealthEventTypeEnum.Pain) {
    summary.pain += 1;
    summary.painLevel += healthEvent.painLevel ?? 0;
  }
}
