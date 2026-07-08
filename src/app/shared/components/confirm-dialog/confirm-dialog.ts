import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  MY_DIALOG_TOKEN,
  MyDialog,
  MyDialogContent,
  MyDialogFooter,
  MyDialogHeader,
  MyDialogRefModel,
} from '../../../library';

export interface ConfirmDialogData {
  icon?: string;
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MyDialog, MyDialogHeader, MyDialogContent, MyDialogFooter, TranslatePipe],
  templateUrl: './confirm-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  private readonly _myDialogRef = inject(MyDialogRefModel);
  private readonly _myDialogToken = inject(MY_DIALOG_TOKEN) as ConfirmDialogData;

  icon = signal<string>(this._myDialogToken?.icon ?? 'download_done');
  title = signal<string>(this._myDialogToken?.title ?? '');
  description = signal<string>(this._myDialogToken?.description ?? '');

  onClickCancel(): void {
    this._myDialogRef.close();
  }

  onClickAccept(): void {
    this._myDialogRef.close(true);
  }
}
