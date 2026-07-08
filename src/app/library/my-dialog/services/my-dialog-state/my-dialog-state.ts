import { ComponentType, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injector, Service } from '@angular/core';

import { MY_DIALOG_TOKEN } from '../../consts';
import { MyDialogConfigInterface } from '../../interfaces';
import { MyDialogRefModel } from '../../models';

@Service()
export class MyDialogState {
  private readonly _overlay = inject(Overlay);
  private readonly _injector = inject(Injector);

  open<T>(component: ComponentType<T>, config?: MyDialogConfigInterface): MyDialogRefModel {
    const positionStrategy = this._overlay.position().global().centerHorizontally().centerVertically();

    const overlayRef = this._overlay.create({
      positionStrategy,
      hasBackdrop: config?.hasBackdrop ?? true,
      backdropClass: 'my-overlay-backdrop',
      panelClass: 'my-dialog-panel',
      minWidth: config?.minWidth ?? 'auto',
      width: config?.width ?? '30rem',
      maxWidth: config?.maxWidth ?? '100%',
      minHeight: config?.minHeight ?? 'auto',
      height: config?.height ?? 'auto',
      maxHeight: config?.maxHeight ?? '100%',
    });

    const dialogRef = new MyDialogRefModel(overlayRef);

    if (config?.canCloseObBackdropClick) {
      dialogRef.listenBackdropClick();
    }

    const injector = Injector.create({
      parent: this._injector,
      providers: [
        { provide: MyDialogRefModel, useValue: dialogRef },
        { provide: MY_DIALOG_TOKEN, useValue: config?.data },
      ],
    });

    const portal = new ComponentPortal<T>(component, null, injector);

    overlayRef.attach(portal);

    return dialogRef;
  }
}
