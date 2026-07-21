import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-layout',
  imports: [TranslatePipe],
  templateUrl: './page-layout.html',
})
export class PageLayout {
  readonly pageIcon = input<string>();
  readonly pageTitle = input<string>();
  readonly showAddButton = input<boolean>(false);

  addClicked = output<void>();
}
