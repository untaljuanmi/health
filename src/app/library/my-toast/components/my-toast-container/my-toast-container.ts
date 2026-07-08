import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { MyToastState } from '../../services';
import { MyToastContainerPositionType } from '../../types';
import { MyToast } from '../my-toast/my-toast';

@Component({
  selector: 'my-toast-container',
  templateUrl: './my-toast-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MyToast],
  host: {
    '[class]': 'position()',
  },
})
export class MyToastContainer {
  private readonly _myToastState = inject(MyToastState);

  position = input<MyToastContainerPositionType>('bc');

  toasts = this._myToastState.toasts.asReadonly();
}
