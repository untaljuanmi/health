import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  OnDestroy,
  signal,
} from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { MyFormError } from '../my-form-error/my-form-error';

export interface MyFormFieldStatusInterface {
  touched: boolean;
  dirty: boolean;
  invalid: boolean;
  required: boolean;
  errors: Record<string, unknown>;
}

@Component({
  selector: 'my-form-field',
  templateUrl: './my-form-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.my-form-required]': 'required()',
    '[class.my-form-error]': 'error()',
    '(focusout)': 'updateStatus()',
    '(keydown.esc)': 'updateStatus()',
  },
})
export class MyFormField implements AfterContentInit, OnDestroy {
  myFormErrorComponents = contentChildren(MyFormError);

  controlDirective = contentChild(NgControl);

  status = signal<MyFormFieldStatusInterface>({
    touched: false,
    dirty: false,
    invalid: false,
    required: false,
    errors: {},
  });

  required = computed(() => this.status().required);
  error = computed(() => (this.status().touched || this.status().dirty) && this.status().invalid);

  private readonly _destroy$ = new Subject<void>();

  ngAfterContentInit(): void {
    const formControl = this.controlDirective()?.control;

    if (!formControl) {
      return;
    }

    this.listenStatusChanges(formControl);
    this.updateStatus();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  updateStatus(): void {
    const formControl = this.controlDirective()?.control;

    if (!formControl) {
      return;
    }

    this.status.set({
      touched: formControl.touched,
      dirty: formControl.dirty,
      invalid: formControl.invalid,
      required: this.hasRequiredValidator(formControl),
      errors: formControl.errors || {},
    });

    this.myFormErrorComponents().forEach((myFormErrorComponent) => {
      myFormErrorComponent.updateVisibility(this.status());
    });
  }

  private hasRequiredValidator(control: AbstractControl): boolean {
    return (
      control.hasError('required') ||
      (control.errors === null && control.validator?.({} as AbstractControl)?.['required'] !== undefined)
    );
  }

  private listenStatusChanges(formControl: AbstractControl): void {
    formControl.statusChanges?.pipe(takeUntil(this._destroy$))?.subscribe(() => this.updateStatus());
  }
}
