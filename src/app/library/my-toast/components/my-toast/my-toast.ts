import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { MyToastState } from '../../services';
import { MyToastType } from '../../types';

@Component({
  selector: 'my-toast',
  templateUrl: './my-toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '`my-toast-${type()}`',
    '[class.my-toast-visible]': 'visible()',
  },
})
export class MyToast {
  private readonly _myToastState = inject(MyToastState);

  id = input.required<number>();
  message = input.required<string>();
  type = input.required<MyToastType>();
  visible = input.required<boolean>();

  onClickRemoveToast(): void {
    this._myToastState.remove(this.id());
  }
}
