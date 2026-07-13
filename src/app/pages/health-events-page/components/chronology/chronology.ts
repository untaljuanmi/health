import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { dateIntoFormDate } from '../../../../library/my-utils';
import { HealthEvent, HealthEventTypeEnum } from '../../../../shared/models';
import { HealthEventsState } from '../../../../state';
import { HealthEventCard } from '../health-event-card/health-event-card';

export interface ChronologyItemDayInterface {
  label: string;
  healthEvents: HealthEvent[];
}

export interface ChronologyItemMonthInterface {
  label: string;
  days: ChronologyItemDayInterface[];
}

export interface ChronologyItemYearInterface {
  label: string;
  months: ChronologyItemMonthInterface[];
}

export interface ChronologyItemInterface {
  years: ChronologyItemYearInterface[];
}

@Component({
  selector: 'app-chronology',
  imports: [HealthEventCard, TranslatePipe, DatePipe, TitleCasePipe],
  templateUrl: './chronology.html',
})
export class Chronology {
  private readonly _healthEventsState = inject(HealthEventsState);

  readonly healthEvents = this._healthEventsState.healthEvents;
  readonly loading = this._healthEventsState.loading;

  readonly chronology = computed((): ChronologyItemInterface => {
    const healthEvents = this.healthEvents();

    const chronology: Record<string, Record<string, Record<string, HealthEvent[]>>> = {};

    healthEvents?.forEach((healthEvent: HealthEvent) => {
      const date = healthEvent.type === HealthEventTypeEnum.Pain ? healthEvent.from : healthEvent.date;

      const yearKey = !date ? 'unknown' : `${date.getFullYear()}`;
      const monthKey = !date ? 'unknown' : `${date.getMonth() + 1}`;
      const dayKey = !date ? 'unknown' : `${dateIntoFormDate(date)}`;

      if (!chronology[yearKey]) {
        chronology[yearKey] = {};
        chronology[yearKey][monthKey] = {};
        chronology[yearKey][monthKey][dayKey] = [healthEvent];
        return;
      }

      if (!chronology[yearKey][monthKey]) {
        chronology[yearKey][monthKey] = {};
        chronology[yearKey][monthKey][dayKey] = [healthEvent];
        return;
      }

      if (!chronology[yearKey][monthKey][dayKey]) {
        chronology[yearKey][monthKey][dayKey] = [healthEvent];
        return;
      }

      chronology[yearKey][monthKey][dayKey].push(healthEvent);
    });

    console.log(chronology);

    const years: ChronologyItemYearInterface[] = Object.entries(chronology)
      .sort(([firstYear], [secondYear]) => Number(secondYear) - Number(firstYear))
      .map(([year, months]) => ({
        label: year,
        months: Object.entries(months)
          .sort(([firstMonth], [secondMonth]) => Number(secondMonth) - Number(firstMonth))
          .map(([month, days]) => ({
            label: month,
            days: Object.entries(days)
              .sort(([firstDate], [secondDate]) => secondDate.localeCompare(firstDate))
              .map(([date, healthEvents]) => ({
                label: date,
                healthEvents: [...healthEvents],
              })),
          })),
      }));

    console.log(years);

    return { years };
  });
}
