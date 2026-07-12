import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { dateIntoFormDateTime, formDateIntoDate } from '../../../../library/my-utils';
import {
  HealthEventDrugInterface,
  HealthEventInterface,
  HealthEventPainTypeEnum,
  HealthEventTypeEnum,
} from '../../../../shared/models';
import { DrugsState, HealthEventsState } from '../../../../state';

export interface HealthEventFormDialogData {
  healthEvent?: HealthEventInterface;
}

@Component({
  selector: 'app-health-event-form-dialog',
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
  templateUrl: './health-event-form-dialog.html',
})
export class HealthEventFormDialog {
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _myDialogRef = inject(MyDialogRefModel);
  private readonly _myDialogToken = inject(MY_DIALOG_TOKEN) as HealthEventFormDialogData;
  private readonly _myToastState = inject(MyToastState);

  private readonly _healthEventsState = inject(HealthEventsState);
  private readonly _drugsState = inject(DrugsState);

  drugs = this._drugsState.drugs;
  types = signal<HealthEventTypeEnum[]>([HealthEventTypeEnum.Pain, HealthEventTypeEnum.Drug]);
  painTypes = signal<HealthEventPainTypeEnum[]>([
    HealthEventPainTypeEnum.Headache,
    HealthEventPainTypeEnum.Nausea,
    HealthEventPainTypeEnum.Vomiting,
    HealthEventPainTypeEnum.Diarrhea,
  ]);

  healthEvent = computed(() => this._myDialogToken?.healthEvent ?? null);

  loading = computed(() => this.getLoadingStatus(this._loading()));

  formGroup = this.buildFormGroup();

  readonly healthEventTypeEnum = HealthEventTypeEnum;

  private readonly _loading = signal<boolean>(false);

  get drugsFormArray(): FormArray {
    return this.formGroup.get('drugs') as FormArray;
  }

  onClickAddNewDrug(): void {
    this.drugsFormArray.push(
      this._formBuilder.group({
        drug: this._formBuilder.control(this.drugs()[0].id, Validators.required),
        quantity: this._formBuilder.control(1, Validators.required),
      })
    );
  }

  onClickRemoveDrug(index: number): void {
    this.drugsFormArray.removeAt(index);
  }

  onClickCancel(): void {
    this._myDialogRef.close();
  }

  onClickSave(): void {
    if (this.formGroup.invalid) {
      this.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.value as HealthEventInterface;

    if (payload.type === HealthEventTypeEnum.Pain) {
      payload.from = formDateIntoDate(payload.from as unknown as string);
      payload.to = formDateIntoDate(payload.to as unknown as string);
    } else {
      payload.date = formDateIntoDate(payload.date as unknown as string);
    }

    const healthEvent: HealthEventInterface | null = this.healthEvent() ?? null;
    const healthEventId: string | null = healthEvent?.id ?? null;

    if (!!healthEvent && !!healthEventId) {
      payload.updated = new Date();

      this._healthEventsState
        .updateHealthEvent(healthEventId, payload)
        .then(() => this._myToastState.success('healthEvents.success.healthEventUpdated'))
        .then(() => this._myDialogRef.close())
        .catch(() => this._myToastState.error('healthEvents.error.healthEventNotUpdated'));

      return;
    }

    payload.created = new Date();

    this._healthEventsState
      .createHealthEvent(payload)
      .then(() => this._myToastState.success('healthEvents.success.healthEventCreated'))
      .then(() => this._myDialogRef.close())
      .catch(() => this._myToastState.error('healthEvents.error.healthEventNotCreated'));
  }

  private buildFormGroup(): FormGroup {
    const healthEvent = this.healthEvent();
    const now = dateIntoFormDateTime(new Date());

    return this._formBuilder.group({
      type: this._formBuilder.control(healthEvent?.type ?? HealthEventTypeEnum.Pain, [Validators.required]),
      description: this._formBuilder.control(healthEvent?.description ?? null),
      painType: this._formBuilder.control(healthEvent?.painType ?? HealthEventPainTypeEnum.Headache, [
        Validators.required,
      ]),
      painLevel: this._formBuilder.control(healthEvent?.painLevel ?? 3, [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
      ]),
      drugs: this.buildDrugsFormArray(healthEvent?.drugs),
      notes: this._formBuilder.control(healthEvent?.notes ?? null),
      from: this._formBuilder.control(healthEvent?.from ?? now, [Validators.required]),
      to: this._formBuilder.control(healthEvent?.to ?? now, [Validators.required]),
      date: this._formBuilder.control(healthEvent?.to ?? now, [Validators.required]),
    });
  }

  private buildDrugsFormArray(drugs?: HealthEventDrugInterface[] | null): FormArray {
    const formArray = this._formBuilder.array([]) as FormArray;
    drugs?.forEach((healthEventDrug: HealthEventDrugInterface) => {
      formArray.push(
        this._formBuilder.group({
          drug: this._formBuilder.control(healthEventDrug.drug, Validators.required),
          quantity: this._formBuilder.control(healthEventDrug.quantity, Validators.required),
        })
      );
    });
    return formArray;
  }

  private getLoadingStatus(loading: boolean): boolean {
    this.formGroup?.get('type')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('description')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('painType')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('painLevel')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('drugs')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('notes')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('from')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('to')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('date')?.[loading ? 'disable' : 'enable']?.();
    return loading;
  }

  private markAllAsTouched(): void {
    this.formGroup.markAllAsTouched();
    this.formGroup.get('type')?.updateValueAndValidity();
    this.formGroup.get('description')?.updateValueAndValidity();
    this.formGroup.get('painType')?.updateValueAndValidity();
    this.formGroup.get('painLevel')?.updateValueAndValidity();
    this.formGroup.get('drugs')?.updateValueAndValidity();
    this.formGroup.get('notes')?.updateValueAndValidity();
    this.formGroup.get('from')?.updateValueAndValidity();
    this.formGroup.get('to')?.updateValueAndValidity();
    this.formGroup.get('date')?.updateValueAndValidity();
  }
}
