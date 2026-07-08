import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { MyCard, MyCardContent, MyCardHeader, MyFormError, MyFormField } from '../../../library';
import { AuthState } from '../../services';

export interface SignUpInterface {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up-page',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    RouterLink,
    MyCard,
    MyCardContent,
    MyCardHeader,
    MyFormError,
    MyFormField,
  ],
  templateUrl: './sign-up-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignUpPage {
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _authService = inject(AuthState);

  private _isLoading = this._authService.isLoading;

  isLoading = computed(() => {
    const _isLoading = this._isLoading();
    this.signUpFormGroup?.get('name')?.[_isLoading ? 'disable' : 'enable']?.();
    this.signUpFormGroup?.get('email')?.[_isLoading ? 'disable' : 'enable']?.();
    this.signUpFormGroup?.get('password')?.[_isLoading ? 'disable' : 'enable']?.();
    return _isLoading;
  });

  signUpFormGroup = this._formBuilder.group<SignUpInterface>({
    name: this._formBuilder.control(null, [Validators.required, Validators.maxLength(255)]),
    email: this._formBuilder.control(null, [Validators.required, Validators.email]),
    password: this._formBuilder.control(null, Validators.required),
  });

  onSubmit(): void {
    if (this.signUpFormGroup.invalid) {
      this.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.signUpFormGroup.value;

    if (!name || !email || !password) {
      this.markAllAsTouched();
      return;
    }

    this._authService.signUp(name, email, password);
  }

  private markAllAsTouched(): void {
    this.signUpFormGroup.markAllAsTouched();
    this.signUpFormGroup.get('name')?.updateValueAndValidity();
    this.signUpFormGroup.get('email')?.updateValueAndValidity();
    this.signUpFormGroup.get('password')?.updateValueAndValidity();
  }
}
