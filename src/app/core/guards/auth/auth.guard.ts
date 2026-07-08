import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from 'firebase/auth';
import { map } from 'rxjs';

import { AuthState } from '../../../auth';

export const privateGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authState = inject(AuthState);

    return authState.authState$.pipe(
      map((user: User | null) => {
        if (!user) {
          router.navigate(['/auth/sign-in']).then();
          return false;
        }

        return true;
      })
    );
  };
};

export const publicGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authState = inject(AuthState);

    return authState.authState$.pipe(
      map((user: User | null) => {
        if (user) {
          router.navigate(['/home']).then();
          return false;
        }

        return true;
      })
    );
  };
};
