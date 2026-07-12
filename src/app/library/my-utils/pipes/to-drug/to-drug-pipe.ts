import { inject, Pipe, PipeTransform } from '@angular/core';

import { Drug } from '../../../../shared/models';
import { DrugsState } from '../../../../state';

@Pipe({
  name: 'toDrug',
})
export class ToDrugPipe implements PipeTransform {
  private _drugsState = inject(DrugsState);
  private _drugs = this._drugsState.drugs;

  transform(id?: string): Drug | null {
    return this._drugs().find((drug: Drug) => drug.id === id) ?? null;
  }
}
