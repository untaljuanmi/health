import { Service, signal } from '@angular/core';
import { User } from 'firebase/auth';

@Service()
export class AppState {
  isAppReady = signal<boolean>(false);

  initState(user: User | null): void {
    this.isAppReady.set(!!user);
  }
}
