import { Service, signal } from '@angular/core';
import { User } from 'firebase/auth';

@Service()
export class AppState {
  readonly user = signal<User | null>(null);

  readonly isAppReady = signal<boolean>(false);

  initState(user: User | null): void {
    this.user.set(user);
    this.isAppReady.set(true);
  }
}
