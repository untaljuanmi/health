import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

export class MyDialogRefModel {
  private readonly _afterClosedSubject = new Subject<unknown>();

  private _closing = false;

  constructor(private _overlayRef: OverlayRef) {}

  get closed(): Observable<unknown> {
    return this._afterClosedSubject.asObservable();
  }

  close(result?: unknown): void {
    if (this._closing || !this._overlayRef.hasAttached()) {
      return;
    }

    this._closing = true;
    this._overlayRef.detach();
    this._afterClosedSubject.next(result);
    this._afterClosedSubject.complete();
    this._closing = false;
  }

  listenBackdropClick(): void {
    this._overlayRef.backdropClick().subscribe((): void => this.close());
  }
}
