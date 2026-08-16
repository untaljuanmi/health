import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MY_DIALOG_TOKEN, MyDialog, MyDialogContent, MyDialogHeader } from '../../../../library';
import { HealthEvent } from '../../../../shared/models';
import { HealthEventCard } from '../../../health-events-page/components/health-event-card/health-event-card';

export interface HealthEventListDialogData {
  healthEvents?: HealthEvent[];
}

@Component({
  selector: 'app-health-event-list-dialog',
  imports: [MyDialog, MyDialogContent, MyDialogHeader, TranslatePipe, HealthEventCard],
  templateUrl: './health-event-list-dialog.html',
})
export class HealthEventListDialog {
  private readonly _myDialogToken = inject(MY_DIALOG_TOKEN) as HealthEventListDialogData;

  healthEvents = computed(() => this._myDialogToken?.healthEvents ?? []);
}
