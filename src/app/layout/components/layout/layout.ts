import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppState } from '../../../core';
import { DrugsState, HealthEventsState } from '../../../state';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-layout',
  imports: [Navbar, RouterOutlet],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  private readonly _appState = inject(AppState);

  private readonly _healthEventsState = inject(HealthEventsState);
  private readonly _drugsState = inject(DrugsState);

  isAppReady = this._appState.isAppReady;
}
