import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-container',
  imports: [TranslatePipe],
  templateUrl: './empty-container.html',
})
export class EmptyContainer {
  emptyIcon = input<string>();
  emptyTitle = input<string>();
  emptyDescription = input<string>();

  loading = input<boolean>(false);
}
