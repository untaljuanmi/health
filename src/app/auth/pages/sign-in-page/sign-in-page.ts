import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { MyCard, MyCardContent, MyCardHeader, MyFormError, MyFormField } from '../../../library';
import { AuthState } from '../../services';

export interface SignInInterface {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-in-page',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    RouterLink,
    MyCard,
    MyCardHeader,
    MyCardContent,
    MyFormField,
    MyFormError,
  ],
  templateUrl: './sign-in-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignInPage {
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _authState = inject(AuthState);

  private _isLoading = this._authState.isLoading;

  isLoading = computed(() => {
    const _isLoading = this._isLoading();
    this.signInFormGroup?.get('email')?.[_isLoading ? 'disable' : 'enable']?.();
    this.signInFormGroup?.get('password')?.[_isLoading ? 'disable' : 'enable']?.();
    return _isLoading;
  });

  signInFormGroup = this._formBuilder.group<SignInInterface>({
    email: this._formBuilder.control(null, [Validators.required, Validators.email]),
    password: this._formBuilder.control(null, Validators.required),
  });

  onSubmit(): void {
    if (this.signInFormGroup.invalid) {
      this.markAllAsTouched();
      return;
    }

    const { email, password } = this.signInFormGroup.value;

    if (!email || !password) {
      this.markAllAsTouched();
      return;
    }

    this._authState.signIn(email, password);
  }

  private markAllAsTouched(): void {
    this.signInFormGroup.markAllAsTouched();
    this.signInFormGroup.get('email')?.updateValueAndValidity();
    this.signInFormGroup.get('password')?.updateValueAndValidity();
  }
}
