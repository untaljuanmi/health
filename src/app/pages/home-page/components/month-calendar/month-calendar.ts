import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { buildMonthCalendarDays, HealthEvent } from '../../../../shared/models';

@Component({
  selector: 'app-month-calendar',
  imports: [TranslatePipe],
  templateUrl: './month-calendar.html',
})
export class MonthCalendar {
  healthEvents = input<HealthEvent[]>([]);
  loading = input<boolean>(false);

  private readonly _currentDate = new Date();

  readonly weekdays = [
    'home.calendar.weekdays.monday',
    'home.calendar.weekdays.tuesday',
    'home.calendar.weekdays.wednesday',
    'home.calendar.weekdays.thursday',
    'home.calendar.weekdays.friday',
    'home.calendar.weekdays.saturday',
    'home.calendar.weekdays.sunday',
  ];

  readonly days = computed(() => buildMonthCalendarDays(this.healthEvents(), this._currentDate));
  readonly weeks = computed(() => {
    const days = this.days();
    return Array.from({ length: days.length / 7 }, (_, index: number) => days.slice(index * 7, index * 7 + 7));
  });
}
