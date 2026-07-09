import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./health-events-page'),
  },
] as Routes;
