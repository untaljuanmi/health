import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthState } from '../../../auth';
import { MyDialogState } from '../../../library';
import { HealthEventFormDialog } from '../../../pages/health-events-page/components/health-event-form-dialog/health-event-form-dialog';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TranslatePipe, RouterLinkActive],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly _myDialogState = inject(MyDialogState);

  private readonly _authState = inject(AuthState);

  onClickSignOut(): void {
    this._authState.signOut();
  }

  onClickAddHealthEvent(): void {
    this._myDialogState.open(HealthEventFormDialog);
  }
}
