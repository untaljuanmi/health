import { Service, Signal, signal } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { finalize, map, tap } from 'rxjs';

import { FirestoreBase } from '../../core';
import { Drug, DrugInterface } from '../../shared/models';

@Service()
export class DrugsState extends FirestoreBase<DrugInterface> {
  private _drugs = signal<Drug[]>([]);
  private _loading = signal<boolean>(false);

  constructor() {
    super('drugs');
    this.getDrugs();
  }

  get drugs(): Signal<Drug[]> {
    return this._drugs.asReadonly();
  }

  get loading(): Signal<boolean> {
    return this._loading.asReadonly();
  }

  getDrugs(): void {
    this._loading.set(true);

    this.getAll()
      .pipe(
        map((data: DocumentData[]) => Drug.buildFromDocumentsData(data)),
        tap((data: Drug[]) => this._drugs.set(data)),
        finalize(() => this._loading.set(false))
      )
      .subscribe();
  }

  updateDrug(id: string, payload: DrugInterface): Promise<void> {
    return this.update(id, payload);
  }

  deleteDrug(id: string): Promise<void> {
    return this.delete(id);
  }
}
