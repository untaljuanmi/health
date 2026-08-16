import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

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
export class HealthEventFormDialog implements OnInit, OnDestroy {
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

  private readonly _destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initFormSubscriptions();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  get drugsFormArray(): FormArray {
    return this.formGroup.get('drugs') as FormArray;
  }

  onClickQuickAction(action: 1 | 2 | 3): void {
    this.drugsFormArray.controls?.forEach((_: AbstractControl, index: number) => this.onClickRemoveDrug(index));

    this.formGroup.patchValue({
      type: 'drug',
      painType: null,
      painLevel: null,
      from: null,
      to: null,
      date: dateIntoFormDateTime(new Date()),
    });

    switch (action) {
      case 1:
        this.onClickAddNewDrug({ drug: 'yFtdeT01yWG2QMHGiGVi', quantity: 2 });
        break;
      case 2:
        this.onClickAddNewDrug({ drug: 'JpbV4LLgIWYZxgvetqDj', quantity: 1 });
        break;
      case 3:
        this.onClickAddNewDrug({ drug: 'pSlkYK69WoY45n5yfh1Q', quantity: 1 });
        break;
    }
  }

  onClickAddNewDrug(healthEventDrug?: HealthEventDrugInterface): void {
    this.drugsFormArray.push(
      this._formBuilder.group({
        drug: this._formBuilder.control(healthEventDrug?.drug ?? this.drugs()[0].id, Validators.required),
        quantity: this._formBuilder.control(healthEventDrug?.quantity ?? 1, Validators.required),
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
      payload.date = null;
    } else {
      payload.from = null;
      payload.to = null;
      payload.date = formDateIntoDate(payload.date as unknown as string);
    }

    const healthEvent: HealthEventInterface | null = this.healthEvent() ?? null;
    const healthEventId: string | null = healthEvent?.id ?? null;

    this._loading.set(true);

    if (!!healthEvent && !!healthEventId) {
      payload.updated = new Date();

      this._healthEventsState
        .updateHealthEvent(healthEventId, payload)
        .then(() => this._myToastState.success('healthEvents.success.healthEventUpdated'))
        .then(() => this._myDialogRef.close())
        .catch(() => this._myToastState.error('healthEvents.error.healthEventNotUpdated'))
        .finally(() => this._loading.set(false));

      return;
    }

    payload.created = new Date();

    this._healthEventsState
      .createHealthEvent(payload)
      .then(() => this._myToastState.success('healthEvents.success.healthEventCreated'))
      .then(() => this._myDialogRef.close())
      .catch(() => this._myToastState.error('healthEvents.error.healthEventNotCreated'))
      .finally(() => this._loading.set(false));
  }

  private buildFormGroup(): FormGroup {
    const healthEvent = this.healthEvent();
    const now = dateIntoFormDateTime(new Date());

    return this._formBuilder.group({
      type: this._formBuilder.control(healthEvent?.type ?? HealthEventTypeEnum.Pain, [Validators.required]),
      description: this._formBuilder.control(healthEvent?.description ?? null),
      painType: this._formBuilder.control(
        healthEvent?.painType ?? HealthEventPainTypeEnum.Headache,
        healthEvent?.type === HealthEventTypeEnum.Pain ? [Validators.required] : []
      ),
      painLevel: this._formBuilder.control(
        healthEvent?.painLevel ?? 3,
        healthEvent?.type === HealthEventTypeEnum.Pain
          ? [Validators.required, Validators.min(1), Validators.max(5)]
          : []
      ),
      drugs: this.buildDrugsFormArray(healthEvent?.drugs),
      notes: this._formBuilder.control(healthEvent?.notes ?? null),
      from: this._formBuilder.control(
        healthEvent?.from ? dateIntoFormDateTime(healthEvent?.from) : now,
        healthEvent?.type === HealthEventTypeEnum.Pain ? [Validators.required] : []
      ),
      to: this._formBuilder.control(
        healthEvent?.to ? dateIntoFormDateTime(healthEvent?.to) : now,
        healthEvent?.type === HealthEventTypeEnum.Pain ? [Validators.required] : []
      ),
      date: this._formBuilder.control(
        healthEvent?.date ? dateIntoFormDateTime(healthEvent?.date) : null,
        healthEvent?.type === HealthEventTypeEnum.Drug ? [Validators.required] : []
      ),
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
    this.formGroup?.get('notes')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('from')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('to')?.[loading ? 'disable' : 'enable']?.();
    this.formGroup?.get('date')?.[loading ? 'disable' : 'enable']?.();
    return loading;
  }

  private markAllAsTouched(): void {
    this.formGroup.markAllAsTouched({ emitEvent: false });
    this.updateValueAndValidity();
  }

  private updateValueAndValidity(): void {
    this.formGroup.get('type')?.updateValueAndValidity({ emitEvent: false });
    this.formGroup.get('description')?.updateValueAndValidity({ emitEvent: false });
    this.formGroup.get('painType')?.updateValueAndValidity({ emitEvent: false });
    this.formGroup.get('painLevel')?.updateValueAndValidity({ emitEvent: false });
    this.formGroup.get('notes')?.updateValueAndValidity({ emitEvent: false });
    this.formGroup.get('from')?.updateValueAndValidity({ emitEvent: false });
    this.formGroup.get('to')?.updateValueAndValidity({ emitEvent: false });
    this.formGroup.get('date')?.updateValueAndValidity({ emitEvent: false });
  }

  private initFormSubscriptions(): void {
    this.formGroup
      .get('type')
      ?.valueChanges?.pipe(takeUntil(this._destroy$))
      ?.subscribe((type: HealthEventTypeEnum) => {
        const healthEvent = this.healthEvent();
        const now = new Date();

        if (type === HealthEventTypeEnum.Drug) {
          this.formGroup.get('painType')?.setValue(null, { emitEvent: false });
          this.formGroup.get('painType')?.disable({ emitEvent: false });
          this.formGroup.get('painType')?.clearValidators();

          this.formGroup.get('painLevel')?.setValue(null, { emitEvent: false });
          this.formGroup.get('painLevel')?.disable({ emitEvent: false });
          this.formGroup.get('painLevel')?.clearValidators();

          this.formGroup.get('from')?.setValue(null, { emitEvent: false });
          this.formGroup.get('from')?.disable({ emitEvent: false });
          this.formGroup.get('from')?.clearValidators();

          this.formGroup.get('to')?.setValue(null, { emitEvent: false });
          this.formGroup.get('to')?.disable({ emitEvent: false });
          this.formGroup.get('to')?.clearValidators();

          this.formGroup.get('date')?.setValue(dateIntoFormDateTime(healthEvent?.date ?? now), { emitEvent: false });
          this.formGroup.get('date')?.enable({ emitEvent: false });
          this.formGroup.get('date')?.setValidators([Validators.required]);

          this.updateValueAndValidity();

          return;
        }

        this.drugsFormArray.controls?.forEach((_: AbstractControl, index: number) => this.onClickRemoveDrug(index));

        this.formGroup
          .get('painType')
          ?.setValue(healthEvent?.painType ?? HealthEventPainTypeEnum.Headache, { emitEvent: false });
        this.formGroup.get('painType')?.enable({ emitEvent: false });
        this.formGroup.get('painType')?.setValidators([Validators.required]);

        this.formGroup.get('painLevel')?.setValue(healthEvent?.painLevel ?? 3, { emitEvent: false });
        this.formGroup.get('painLevel')?.enable({ emitEvent: false });
        this.formGroup.get('painLevel')?.setValidators([Validators.required]);

        this.formGroup.get('from')?.setValue(dateIntoFormDateTime(healthEvent?.from ?? now), { emitEvent: false });
        this.formGroup.get('from')?.enable({ emitEvent: false });
        this.formGroup.get('from')?.setValidators([Validators.required]);

        this.formGroup.get('to')?.setValue(dateIntoFormDateTime(healthEvent?.to ?? now), { emitEvent: false });
        this.formGroup.get('to')?.enable({ emitEvent: false });
        this.formGroup.get('to')?.setValidators([Validators.required]);

        this.formGroup.get('date')?.setValue(null, { emitEvent: false });
        this.formGroup.get('date')?.disable({ emitEvent: false });
        this.formGroup.get('date')?.clearValidators();

        this.updateValueAndValidity();
      });
  }
}
