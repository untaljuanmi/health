import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import packageJson from '../../../../package.json';
import { HealthEvent, HealthEventTypeEnum } from '../../shared/models';
import { HealthEventsState } from '../../state';
import { Chronology } from '../health-events-page/components/chronology/chronology';

@Component({
  selector: 'app-home-page',
  imports: [TranslatePipe, Chronology],
  templateUrl: './home-page.html',
})
export default class HomePage {
  private readonly _healthEventsState = inject(HealthEventsState);

  readonly healthEvents = this._healthEventsState.healthEvents;
  readonly loading = this._healthEventsState.loading;

  readonly state = computed(() => {
    const healthEvents = this.healthEvents();
    const now = new Date();

    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let month = 0;
    let year = 0;

    healthEvents.forEach((healthEvent: HealthEvent) => {
      if (healthEvent.type === HealthEventTypeEnum.Drug) {
        return;
      }

      if (healthEvent.from?.getFullYear() === thisYear) {
        year++;

        if (healthEvent.from?.getMonth() === thisMonth) {
          month++;
        }
      }
    });

    return { month, year };
  });

  protected readonly appVersion = packageJson.version;
}
