import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { interval } from 'rxjs';

import { MyDialogRefModel, MyDialogState } from '../../../library';
import { ConfirmDialog } from '../../../shared';

@Injectable({
  providedIn: 'root',
})
export class AppUpdateState {
  private readonly _myDialogState = inject(MyDialogState);

  private readonly _swUpdate = inject(SwUpdate);

  constructor() {
    this.listenForVersionUpdates();
    this.checkForUpdatesPeriodically();
  }

  private listenForVersionUpdates(): void {
    if (!this._swUpdate.isEnabled) {
      return;
    }

    this._swUpdate.versionUpdates.subscribe((event: VersionEvent): void => {
      if (event.type === 'VERSION_READY') {
        const _myDialogRef: MyDialogRefModel = this._myDialogState.open(ConfirmDialog, {
          data: {
            icon: 'deployed_code_update',
            title: 'common.confirm.update.title',
            description: 'common.confirm.update.description',
          },
        });

        _myDialogRef.closed.subscribe((shouldReload: unknown): void => {
          if (shouldReload) {
            window.location.reload();
          }
        });
      }
    });
  }

  private checkForUpdatesPeriodically(): void {
    if (!this._swUpdate.isEnabled) {
      return;
    }

    interval(6 * 60 * 60 * 1000).subscribe((): void => void this._swUpdate.checkForUpdate());
  }
}
