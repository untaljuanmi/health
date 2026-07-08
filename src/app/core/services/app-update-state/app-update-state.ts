import { inject, Service } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { interval } from 'rxjs';

import { MyDialogRefModel, MyDialogState } from '../../../library';
import { ConfirmDialog } from '../../../shared';

@Service()
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
        console.log('⬇️ New version available!');
        const _myDialogRef: MyDialogRefModel = this._myDialogState.open(ConfirmDialog, {
          data: {
            icon: 'deployed_code_update',
            title: 'common.confirm.update.title',
            description: 'common.confirm.update.description',
          },
        });

        _myDialogRef.closed.subscribe(async (shouldReload: unknown): Promise<void> => {
          if (shouldReload) {
            await this._swUpdate.activateUpdate();
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

    interval(10 * 60 * 1000).subscribe((): void => {
      console.log('💭 Checking for new versions...');
      void this._swUpdate.checkForUpdate();
    });
  }
}
