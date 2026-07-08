import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-card',
  templateUrl: './my-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCard {}
