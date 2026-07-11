import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MyDialogState, MyToastState } from '../../../../library';
import { ConfirmDialog } from '../../../../shared';
import { HealthEvent } from '../../../../shared/models';
import { HealthEventsState } from '../../../../state';
import { HealthEventFormDialog } from '../health-event-form-dialog/health-event-form-dialog';

@Component({
  selector: 'app-health-event-card',
  imports: [TranslatePipe, DatePipe],
  templateUrl: './health-event-card.html',
})
export class HealthEventCard {
  private readonly _myDialogState = inject(MyDialogState);
  private readonly _myToastState = inject(MyToastState);

  private readonly _healthEventsState = inject(HealthEventsState);

  healthEvent = input.required<HealthEvent>();

  onClickDeleteHealthEvent(healthEvent: HealthEvent): void {
    const dialogRef = this._myDialogState.open(ConfirmDialog, {
      data: {
        icon: 'delete',
        title: 'healthEvents.confirm.delete.title',
        description: 'healthEvents.confirm.delete.description',
      },
    });

    dialogRef.closed.subscribe((result: unknown) => {
      if (!result || !healthEvent.id) {
        return;
      }

      this._healthEventsState
        .deleteHealthEvent(healthEvent.id)
        .then(() => this._myToastState.success('healthEvents.success.healthEventDeleted'))
        .catch(() => this._myToastState.error('healthEvents.error.healthEventNotDeleted'));
    });
  }

  onClickUpdateHealthEvent(healthEvent: HealthEvent): void {
    this._myDialogState.open(HealthEventFormDialog, { data: { healthEvent } });
  }
}
