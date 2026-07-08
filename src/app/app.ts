import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppUpdateState } from './core';
import { MyToastContainer } from './library';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly _appUpdateState = inject(AppUpdateState);

  constructor() {
    afterNextRender(() => document.addEventListener('touchstart', () => null, { passive: true }));
  }
}
