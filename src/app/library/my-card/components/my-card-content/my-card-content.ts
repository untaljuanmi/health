import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-card-content',
  templateUrl: './my-card-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCardContent {}
