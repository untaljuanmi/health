import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthState } from '../../../auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TranslatePipe, RouterLinkActive],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly _authState = inject(AuthState);

  onClickSignOut(): void {
    this._authState.signOut();
  }
}
