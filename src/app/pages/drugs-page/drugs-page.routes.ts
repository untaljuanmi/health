import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./drugs-page'),
  },
] as Routes;
