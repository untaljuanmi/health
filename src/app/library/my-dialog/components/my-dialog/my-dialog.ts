import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-dialog',
  templateUrl: './my-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyDialog {}
