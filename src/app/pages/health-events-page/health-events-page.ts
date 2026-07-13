import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MyDialogState } from '../../library';
import { Chronology } from './components/chronology/chronology';
import { HealthEventFormDialog } from './components/health-event-form-dialog/health-event-form-dialog';

@Component({
  selector: 'app-health-events-page',
  imports: [TranslatePipe, Chronology],
  templateUrl: './health-events-page.html',
})
export default class HealthEventsPage {
  private readonly _myDialogState = inject(MyDialogState);

  onClickAddHealthEvent(): void {
    this._myDialogState.open(HealthEventFormDialog);
  }
}
