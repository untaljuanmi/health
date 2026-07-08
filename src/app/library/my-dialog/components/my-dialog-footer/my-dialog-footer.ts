import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-dialog-footer',
  templateUrl: './my-dialog-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyDialogFooter {}
