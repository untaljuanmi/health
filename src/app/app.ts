import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppState, AppUpdateState } from './core';
import { Navbar } from './layout';
import { MyToastContainer } from './library';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyToastContainer, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly _appUpdateState = inject(AppUpdateState);
  private readonly _appState = inject(AppState);

  isAppReady = this._appState.isAppReady;

  constructor() {
    afterNextRender(() => document.addEventListener('touchstart', () => null, { passive: true }));
  }
}
