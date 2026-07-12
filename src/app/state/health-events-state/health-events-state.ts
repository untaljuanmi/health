import { Service, Signal, signal } from '@angular/core';
import { DocumentData, DocumentReference, orderBy } from '@angular/fire/firestore';
import { catchError, map, NEVER, tap } from 'rxjs';

import { FirestoreBase } from '../../core';
import { HealthEvent, HealthEventInterface } from '../../shared/models';

@Service()
export class HealthEventsState extends FirestoreBase<HealthEventInterface> {
  private _healthEvents = signal<HealthEvent[]>([]);
  private _loading = signal<boolean>(false);

  constructor() {
    super('health-events');
    this.getHealthEvents();
  }

  get healthEvents(): Signal<HealthEvent[]> {
    return this._healthEvents.asReadonly();
  }

  get loading(): Signal<boolean> {
    return this._loading.asReadonly();
  }

  getHealthEvents(): void {
    this._loading.set(true);

    const query = [orderBy('created', 'desc')];

    this.getAll(query)
      .pipe(
        map((data: DocumentData[]) => HealthEvent.buildFromDocumentsData(data)),
        tap((data: HealthEvent[]) => this._healthEvents.set(data)),
        tap(() => this._loading.set(false)),
        catchError(() => {
          this._loading.set(false);
          return NEVER;
        })
      )
      .subscribe();
  }

  createHealthEvent(payload: HealthEventInterface): Promise<DocumentReference> {
    return this.add(payload);
  }

  updateHealthEvent(id: string, payload: HealthEventInterface): Promise<void> {
    return this.update(id, payload);
  }

  deleteHealthEvent(id: string): Promise<void> {
    return this.delete(id);
  }
}
