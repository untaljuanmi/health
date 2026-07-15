import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-quick-stat-card',
  imports: [TranslatePipe],
  templateUrl: './quick-stat-card.html',
})
export class QuickStatCard {
  icon = input<string>();
  value = input<string | number>();
  loading = input<boolean>(false);
}
