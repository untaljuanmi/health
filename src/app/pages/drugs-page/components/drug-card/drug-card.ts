import { Component, inject, input } from '@angular/core';

import { MyDialogState, MyToastState } from '../../../../library';
import { ConfirmDialog } from '../../../../shared';
import { Drug } from '../../../../shared/models';
import { DrugsState } from '../../../../state';
import { DrugFormDialog } from '../drug-form-dialog/drug-form-dialog';

@Component({
  selector: 'app-drug-card',
  imports: [],
  templateUrl: './drug-card.html',
})
export class DrugCard {
  private readonly _myDialogState = inject(MyDialogState);
  private readonly _myToastState = inject(MyToastState);

  private readonly _drugsState = inject(DrugsState);

  drug = input.required<Drug>();
  quantity = input<number | null>();

  onClickDeleteDrug(drug: Drug): void {
    const dialogRef = this._myDialogState.open(ConfirmDialog, {
      data: { icon: 'delete', title: 'drugs.confirm.delete.title', description: 'drugs.confirm.delete.description' },
    });

    dialogRef.closed.subscribe((result: unknown) => {
      if (!result || !drug.id) {
        return;
      }

      this._drugsState
        .deleteDrug(drug.id)
        .then(() => this._myToastState.success('drugs.success.drugDeleted'))
        .catch(() => this._myToastState.error('drugs.error.drugNotDeleted'));
    });
  }

  onClickUpdateDrug(drug: Drug): void {
    this._myDialogState.open(DrugFormDialog, { data: { drug } });
  }
}
