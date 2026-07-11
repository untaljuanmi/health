import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

export class MyDialogRefModel {
  private readonly _afterClosedSubject = new Subject<unknown>();

  constructor(private _overlayRef: OverlayRef) {}

  get closed(): Observable<unknown> {
    return this._afterClosedSubject.asObservable();
  }

  close(result?: unknown): void {
    // this._overlayRef.addPanelClass('my-dialog-panel-exit-animation');
    // this._overlayRef.detachBackdrop();
    this._afterClosedSubject.next(result);
    this._afterClosedSubject.complete();
    this._overlayRef.dispose();
    // setTimeout((): void => {
    // }, 400);
  }

  listenBackdropClick(): void {
    this._overlayRef.backdropClick().subscribe((): void => this.close());
  }
}
