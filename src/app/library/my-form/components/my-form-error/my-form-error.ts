import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { MyFormFieldStatusInterface } from '../my-form-field/my-form-field';

@Component({
  selector: 'my-form-error',
  templateUrl: './my-form-error.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFormError {
  key = input<string | null>(null);

  visible = signal<boolean>(false);

  updateVisibility(status: MyFormFieldStatusInterface): void {
    const visible: boolean =
      (status.touched || status.dirty) && status.errors && !!this.key() && !!status.errors[this.key()!];
    this.visible.set(visible);
  }
}
