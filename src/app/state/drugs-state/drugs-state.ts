import { Service, Signal, signal } from '@angular/core';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { catchError, map, NEVER, tap } from 'rxjs';

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
        tap(() => this._loading.set(false)),
        catchError(() => {
          this._loading.set(false);
          return NEVER;
        })
      )
      .subscribe();
  }

  createDrug(payload: DrugInterface): Promise<DocumentReference> {
    return this.add(payload);
  }

  updateDrug(id: string, payload: DrugInterface): Promise<void> {
    return this.update(id, payload);
  }

  deleteDrug(id: string): Promise<void> {
    return this.delete(id);
  }
}
