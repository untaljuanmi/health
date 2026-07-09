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
import { HealthEventInterface, HealthEventPainTypeEnum } from '../../../../shared/models';
import { HealthEventsState } from '../../../../state';

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

  painTypes = signal<HealthEventPainTypeEnum[]>([
    HealthEventPainTypeEnum.Headache,
    HealthEventPainTypeEnum.Nausea,
    HealthEventPainTypeEnum.Vomiting,
    HealthEventPainTypeEnum.Diarrhea,
  ]);

  healthEvent = computed(() => this._myDialogToken?.healthEvent ?? null);

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

    const payload = this.formGroup.value as HealthEventInterface;

    const healthEvent: HealthEventInterface | null = this.healthEvent() ?? null;
    const healthEventId: string | null = healthEvent?.id ?? null;

    if (!!healthEvent && !!healthEventId) {
      this._healthEventsState
        .updateHealthEvent(healthEventId, payload)
        .then(() => this._myToastState.success('healthEvents.success.healthEventUpdated'))
        .then(() => this._myDialogRef.close())
        .catch(() => this._myToastState.error('healthEvents.error.healthEventNotUpdated'));

      return;
    }

    this._healthEventsState
      .createHealthEvent(payload)

      .then(() => this._myToastState.success('healthEvents.success.healthEventCreated'))
      .then(() => this._myDialogRef.close())
      .catch(() => this._myToastState.error('healthEvents.error.healthEventNotCreated'));
  }

  private buildFormGroup(): FormGroup {
    const healthEvent = this.healthEvent();
    return this._formBuilder.group({
      title: this._formBuilder.control(healthEvent?.title ?? null, [Validators.required]),
      description: this._formBuilder.control(healthEvent?.description ?? null),
      painType: this._formBuilder.control(healthEvent?.painType ?? HealthEventPainTypeEnum.Headache, [
        Validators.required,
      ]),
      painLevel: this._formBuilder.control(healthEvent?.painLevel ?? 5, [
        Validators.required,
        Validators.min(0),
        Validators.max(10),
      ]),
      drugs: this._formBuilder.control(healthEvent?.drugs ?? null),
      notes: this._formBuilder.control(healthEvent?.notes ?? null),
      from: this._formBuilder.control(healthEvent?.from ?? new Date(), [Validators.required]),
      to: this._formBuilder.control(healthEvent?.to ?? new Date(), [Validators.required]),
    });
  }

  private getLoadingStatus(loading: boolean): boolean {
    this.formGroup?.get('title')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('description')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('painType')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('painLevel')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('drugs')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('notes')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('from')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('to')?.[loading ? 'disable' : 'enable']?.();
    return loading;
  }

  private markAllAsTouched(): void {
    this.formGroup.markAllAsTouched();
    this.formGroup.get('title')?.updateValueAndValidity();
    this.formGroup.get('description')?.updateValueAndValidity();
    this.formGroup.get('painType')?.updateValueAndValidity();
    this.formGroup.get('painLevel')?.updateValueAndValidity();
    this.formGroup.get('drugs')?.updateValueAndValidity();
    this.formGroup.get('notes')?.updateValueAndValidity();
    this.formGroup.get('from')?.updateValueAndValidity();
    this.formGroup.get('to')?.updateValueAndValidity();
  }
}
