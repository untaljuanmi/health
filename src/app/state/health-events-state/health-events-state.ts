import { Service, Signal, signal } from '@angular/core';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { finalize, map, tap } from 'rxjs';

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

    this.getAll()
      .pipe(
        map((data: DocumentData[]) => HealthEvent.buildFromDocumentsData(data)),
        tap((data: HealthEvent[]) => this._healthEvents.set(data)),
        finalize(() => this._loading.set(false))
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
