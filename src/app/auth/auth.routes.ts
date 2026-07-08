import { Routes } from '@angular/router';

export default [
  { path: 'sign-in', loadComponent: () => import('./pages/sign-in-page/sign-in-page') },
  { path: 'sign-up', loadComponent: () => import('./pages/sign-up-page/sign-up-page') },
  { path: '**', redirectTo: 'sign-in' },
] as Routes;
