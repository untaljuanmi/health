import { Component, inject } from '@angular/core';

import { HealthEventsState } from '../../state';

@Component({
  selector: 'app-health-events-page',
  imports: [],
  templateUrl: './health-events-page.html',
})
export default class HealthEventsPage {
  private readonly _healthEventsState = inject(HealthEventsState);

  readonly healthEvents = this._healthEventsState.healthEvents;
}
