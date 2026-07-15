import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import packageJson from '../../../../package.json';
import { HealthEvent, HealthEventTypeEnum } from '../../shared/models';
import { HealthEventsState } from '../../state';
import { MonthCalendar } from './components/month-calendar/month-calendar';
import { QuickStatCard } from './components/quick-stat-card/quick-stat-card';
import {
  addHealthEventToSummary,
  buildDateRanges,
  createSummary,
  HomePagePeriod,
  HomePageStateInterface,
  isDateInRange,
} from './models/home-page.model';

@Component({
  selector: 'app-home-page',
  imports: [TranslatePipe, MonthCalendar, QuickStatCard],
  templateUrl: './home-page.html',
})
export default class HomePage {
  private readonly _healthEventsState = inject(HealthEventsState);

  readonly healthEvents = this._healthEventsState.healthEvents;
  readonly loading = this._healthEventsState.loading;

  readonly state = computed((): HomePageStateInterface => {
    const healthEvents = this.healthEvents();
    const ranges = buildDateRanges(new Date());

    const state: HomePageStateInterface = {
      today: createSummary(),
      yesterday: createSummary(),
      thisWeek: createSummary(),
      lastWeek: createSummary(),
      thisMonth: createSummary(),
      lastMonth: createSummary(),
      thisYear: createSummary(),
      lastYear: createSummary(),
    };

    const periods = Object.keys(state) as HomePagePeriod[];

    healthEvents.forEach((healthEvent: HealthEvent) => {
      const date = healthEvent.type === HealthEventTypeEnum.Pain ? healthEvent.from : healthEvent.date;

      if (!date) {
        return;
      }

      periods.forEach((period: HomePagePeriod) => {
        if (isDateInRange(date, ranges[period])) {
          addHealthEventToSummary(state[period], healthEvent);
        }
      });
    });

    periods.forEach((period: HomePagePeriod) => {
      const summary = state[period];
      summary.painAverage = Math.round((summary.painLevel / summary.pain) * 10) / 10;
    });

    return state;
  });

  readonly appVersion = packageJson.version;
}
