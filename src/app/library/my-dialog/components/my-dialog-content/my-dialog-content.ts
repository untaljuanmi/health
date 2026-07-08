import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-dialog-content',
  templateUrl: './my-dialog-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyDialogContent {}
