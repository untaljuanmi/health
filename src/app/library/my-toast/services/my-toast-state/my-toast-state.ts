import { inject, Service, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MyToastInterface } from '../../interfaces';
import { MyToastType } from '../../types';

@Service()
export class MyToastState {
  private readonly _translateService = inject(TranslateService);

  toasts = signal<MyToastInterface[]>([]);

  info(message: string, delay = 3000): number {
    return this.show(message, 'info', delay);
  }

  success(message: string, delay = 3000): number {
    return this.show(message, 'success', delay);
  }

  warning(message: string, delay = 3000): number {
    return this.show(message, 'warning', delay);
  }

  error(message: string, delay = 3000): number {
    return this.show(message, 'error', delay);
  }

  remove(id: number): void {
    this.toasts.update((toasts: MyToastInterface[]) => {
      const _toast = toasts.find((toast: MyToastInterface) => toast.id === id);

      if (_toast) {
        _toast.visible = false;
      }

      return [...toasts];
    });

    setTimeout(
      () =>
        this.toasts.update((toasts: MyToastInterface[]) => toasts.filter((toast: MyToastInterface) => toast.id !== id)),
      300
    );
  }

  private show(message: string, type: MyToastType, delay: number): number {
    const id: number = Date.now();
    const translatedMessage: string = this._translateService.instant(message);
    const visible = true;
    const toast: MyToastInterface = { id, message: translatedMessage, type, visible };
    this.toasts.update((toasts: MyToastInterface[]) => [...toasts, toast]);
    setTimeout(() => this.remove(id), delay);
    return id;
  }
}
