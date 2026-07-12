import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import {
  MY_DIALOG_TOKEN,
  MyDialog,
  MyDialogContent,
  MyDialogFooter,
  MyDialogHeader,
  MyDialogRefModel,
  MyFormError,
  MyFormField,
  MyToastState,
} from '../../../../library';
import { DrugInterface, DrugMeasureEnum } from '../../../../shared/models';
import { DrugsState } from '../../../../state';

export interface DrugFormDialogData {
  drug?: DrugInterface;
}

@Component({
  selector: 'app-drug-form-dialog',
  imports: [
    MyDialog,
    MyDialogHeader,
    MyDialogContent,
    MyFormField,
    MyFormError,
    MyDialogFooter,
    TranslatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './drug-form-dialog.html',
})
export class DrugFormDialog {
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _myDialogRef = inject(MyDialogRefModel);
  private readonly _myDialogToken = inject(MY_DIALOG_TOKEN) as DrugFormDialogData;
  private readonly _myToastState = inject(MyToastState);

  private readonly _drugsState = inject(DrugsState);

  measures = signal<DrugMeasureEnum[]>([DrugMeasureEnum.Mg, DrugMeasureEnum.Ml]);

  drug = computed(() => this._myDialogToken?.drug ?? null);

  loading = computed(() => this.getLoadingStatus(this._loading()));

  formGroup = this.buildFormGroup();

  private readonly _loading = signal<boolean>(false);

  onClickCancel(): void {
    this._myDialogRef.close();
  }

  onClickSave(): void {
    if (this.formGroup.invalid) {
      this.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.value as DrugInterface;

    const drug: DrugInterface | null = this.drug() ?? null;
    const drugId: string | null = drug?.id ?? null;

    if (!!drug && !!drugId) {
      payload.updated = new Date();

      this._drugsState
        .updateDrug(drugId, payload)
        .then(() => this._myToastState.success('drugs.success.drugUpdated'))
        .then(() => this._myDialogRef.close())
        .catch(() => this._myToastState.error('drugs.error.drugNotUpdated'));

      return;
    }

    payload.created = new Date();

    this._drugsState
      .createDrug(payload)
      .then(() => this._myToastState.success('drugs.success.drugCreated'))
      .then(() => this._myDialogRef.close())
      .catch(() => this._myToastState.error('drugs.error.drugNotCreated'));
  }

  private buildFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: this._formBuilder.control(this.drug()?.name ?? null, [Validators.required]),
      description: this._formBuilder.control(this.drug()?.description ?? null),
      measure: this._formBuilder.control(this.drug()?.measure ?? 1, [Validators.required, Validators.min(1)]),
      measureType: this._formBuilder.control(this.drug()?.measureType ?? DrugMeasureEnum.Mg, [Validators.required]),
      notes: this._formBuilder.control(this.drug()?.notes ?? null),
    });
  }

  private getLoadingStatus(loading: boolean): boolean {
    this.formGroup?.get('name')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('description')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('measure')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('measureType')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('notes')?.[loading ? 'disable' : 'enable']?.();
    return loading;
  }

  private markAllAsTouched(): void {
    this.formGroup.markAllAsTouched();
    this.formGroup.get('name')?.updateValueAndValidity();
    this.formGroup.get('description')?.updateValueAndValidity();
    this.formGroup.get('measure')?.updateValueAndValidity();
    this.formGroup.get('measureType')?.updateValueAndValidity();
    this.formGroup.get('notes')?.updateValueAndValidity();
  }
}
