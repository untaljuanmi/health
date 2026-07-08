import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppState {
  isAppReady = signal<boolean>(false);

  initState(): void {
    this.isAppReady.set(true);
  }
}
