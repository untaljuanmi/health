import { Injectable, signal } from '@angular/core';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AppState {
  isAppReady = signal<boolean>(false);

  initState(user: User | null): void {
    this.isAppReady.set(!!user);
  }
}
