import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'my-card-header',
  templateUrl: './my-card-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCardHeader {
  divider = input<boolean>(false);
}
