import { Component, computed, inject, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MyDialogState } from '../../../../library';
import { buildMonthCalendarDays, HealthEvent } from '../../../../shared/models';
import { HealthEventListDialog } from '../health-event-list-dialog/health-event-list-dialog';

@Component({
  selector: 'app-month-calendar',
  imports: [TranslatePipe],
  templateUrl: './month-calendar.html',
})
export class MonthCalendar {
  private readonly _myDialogState = inject(MyDialogState);

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

  month = signal<number>(this._currentDate.getMonth());
  year = signal<number>(this._currentDate.getFullYear());

  readonly days = computed(() =>
    buildMonthCalendarDays(this.healthEvents(), this._currentDate, this.month(), this.year())
  );
  readonly weeks = computed(() => {
    const days = this.days();
    return Array.from({ length: days.length / 7 }, (_, index: number) => days.slice(index * 7, index * 7 + 7));
  });

  onClickPreviousMonth(): void {
    const month = this.month();

    if (month === 0) {
      this.year.update((year: number) => year - 1);
      this.month.set(11);
      return;
    }

    this.month.update((month: number) => month - 1);
  }

  onClickNextMonth(): void {
    const month = this.month();

    if (month === 11) {
      this.year.update((year: number) => year + 1);
      this.month.set(0);
      return;
    }

    this.month.update((month: number) => month + 1);
  }

  onClickCalendarDay(healthEvents: HealthEvent[]): void {
    if (!healthEvents.length) {
      return;
    }

    const height = healthEvents.length === 1 ? 'auto' : '100%';
    this._myDialogState.open(HealthEventListDialog, { height, data: { healthEvents } });
  }
}
