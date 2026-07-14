import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import packageJson from '../../../../package.json';
import { HealthEvent, HealthEventTypeEnum } from '../../shared/models';
import { HealthEventsState } from '../../state';

@Component({
  selector: 'app-home-page',
  imports: [TranslatePipe],
  templateUrl: './home-page.html',
})
export default class HomePage {
  private readonly _healthEventsState = inject(HealthEventsState);

  readonly healthEvents = this._healthEventsState.healthEvents;
  readonly loading = this._healthEventsState.loading;

  readonly state = computed(() => {
    const healthEvents = this.healthEvents();
    const now = new Date();

    const today = { drug: 0, pain: 0, painLevel: 0, painAverage: 0 };
    const thisMonth = { drug: 0, pain: 0, painLevel: 0, painAverage: 0 };
    const thisYear = { drug: 0, pain: 0, painLevel: 0, painAverage: 0 };

    healthEvents.forEach((healthEvent: HealthEvent) => {
      const date = healthEvent.type === HealthEventTypeEnum.Pain ? healthEvent.from : healthEvent.date;

      if (date?.getFullYear() === now.getFullYear()) {
        thisYear.drug = healthEvent.type === HealthEventTypeEnum.Drug ? thisYear.drug + 1 : thisYear.drug;
        thisYear.pain = healthEvent.type === HealthEventTypeEnum.Pain ? thisYear.pain + 1 : thisYear.pain;
        thisYear.painLevel =
          healthEvent.type === HealthEventTypeEnum.Pain
            ? thisYear.painLevel + (healthEvent.painLevel ?? 0)
            : thisYear.painLevel;

        if (date?.getMonth() === now.getMonth()) {
          thisMonth.drug = healthEvent.type === HealthEventTypeEnum.Drug ? thisMonth.drug + 1 : thisMonth.drug;
          thisMonth.pain = healthEvent.type === HealthEventTypeEnum.Pain ? thisMonth.pain + 1 : thisMonth.pain;
          thisMonth.painLevel =
            healthEvent.type === HealthEventTypeEnum.Pain
              ? thisMonth.painLevel + (healthEvent.painLevel ?? 0)
              : thisMonth.painLevel;

          if (date?.getDate() === now.getDate()) {
            today.drug = healthEvent.type === HealthEventTypeEnum.Drug ? today.drug + 1 : today.drug;
            today.pain = healthEvent.type === HealthEventTypeEnum.Pain ? today.pain + 1 : today.pain;
            today.painLevel =
              healthEvent.type === HealthEventTypeEnum.Pain
                ? today.painLevel + (healthEvent.painLevel ?? 0)
                : today.painLevel;
          }
        }
      }
    });

    today.painAverage = today.painLevel / today.pain;
    thisMonth.painAverage = thisMonth.painLevel / thisMonth.pain;
    thisYear.painAverage = thisYear.painLevel / thisYear.pain;

    return { today, thisMonth, thisYear };
  });

  protected readonly appVersion = packageJson.version;
}
