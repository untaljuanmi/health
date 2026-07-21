import { Component, input } from '@angular/core';

@Component({
  selector: 'app-quick-stat-card',
  imports: [],
  templateUrl: './quick-stat-card.html',
})
export class QuickStatCard {
  icon = input<string>();
  value = input<number>();
  outOf = input<number>();
  loading = input<boolean>(false);
}
