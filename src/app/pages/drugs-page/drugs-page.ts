import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MyDialogState } from '../../library';
import { DrugsState } from '../../state';
import { DrugCard } from './components/drug-card/drug-card';
import { DrugFormDialog } from './components/drug-form-dialog/drug-form-dialog';

@Component({
  selector: 'app-drugs-page',
  imports: [DrugCard, TranslatePipe],
  templateUrl: './drugs-page.html',
})
export default class DrugsPage {
  private readonly _myDialogState = inject(MyDialogState);

  private readonly _drugsState = inject(DrugsState);

  readonly drugs = this._drugsState.drugs;

  onClickAddDrug(): void {
    this._myDialogState.open(DrugFormDialog);
  }
}
