import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MyDialogState } from '../../library';
import { HealthEventsState } from '../../state';
import { HealthEventCard } from './components/health-event-card/health-event-card';
import { HealthEventFormDialog } from './components/health-event-form-dialog/health-event-form-dialog';

@Component({
  selector: 'app-health-events-page',
  imports: [TranslatePipe, HealthEventCard],
  templateUrl: './health-events-page.html',
})
export default class HealthEventsPage {
  private readonly _myDialogState = inject(MyDialogState);

  private readonly _healthEventsState = inject(HealthEventsState);

  readonly healthEvents = this._healthEventsState.healthEvents;

  onClickAddHealthEvent(): void {
    this._myDialogState.open(HealthEventFormDialog);
  }
}
