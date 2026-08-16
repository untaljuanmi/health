import { Component, inject } from '@angular/core';

import { MyDialogState } from '../../library';
import { PageLayout } from '../../shared';
import { HealthEventsState } from '../../state';
import { MonthCalendar } from '../home-page/components/month-calendar/month-calendar';
import { Chronology } from './components/chronology/chronology';
import { HealthEventFormDialog } from './components/health-event-form-dialog/health-event-form-dialog';

@Component({
  selector: 'app-health-events-page',
  imports: [Chronology, PageLayout, MonthCalendar],
  templateUrl: './health-events-page.html',
})
export default class HealthEventsPage {
  private readonly _myDialogState = inject(MyDialogState);

  private readonly _healthEventsState = inject(HealthEventsState);

  readonly healthEvents = this._healthEventsState.healthEvents;
  readonly loading = this._healthEventsState.loading;

  onClickAddHealthEvent(): void {
    this._myDialogState.open(HealthEventFormDialog);
  }
}
