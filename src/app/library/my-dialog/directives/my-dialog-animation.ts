import { Directive } from '@angular/core';

@Directive({
  host: {
    class: 'my-dialog-surface',
    'animate.enter': 'my-dialog-enter',
    'animate.leave': 'my-dialog-leave',
  },
})
export class MyDialogAnimation {}
