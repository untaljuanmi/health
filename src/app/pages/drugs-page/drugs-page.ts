import { Component, inject } from '@angular/core';

import { DrugsState } from '../../state';

@Component({
  selector: 'app-drugs-page',
  imports: [],
  templateUrl: './drugs-page.html',
})
export default class DrugsPage {
  private readonly _drugsState = inject(DrugsState);

  readonly drugs = this._drugsState.drugs;
}
