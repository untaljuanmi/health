import { Component, inject } from '@angular/core';

import { MyDialogState } from '../../library';
import { PageLayout } from '../../shared';
import { Chronology } from './components/chronology/chronology';
import { HealthEventFormDialog } from './components/health-event-form-dialog/health-event-form-dialog';

@Component({
  selector: 'app-health-events-page',
  imports: [Chronology, PageLayout],
  templateUrl: './health-events-page.html',
})
export default class HealthEventsPage {
  private readonly _myDialogState = inject(MyDialogState);

  onClickAddHealthEvent(): void {
    this._myDialogState.open(HealthEventFormDialog);
  }
}
