import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-card-footer',
  templateUrl: './my-card-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCardFooter {}
