import { Routes } from '@angular/router';

import { privateGuard, publicGuard } from './core';
import { Layout } from './layout';

export const routes: Routes = [
  {
    canActivateChild: [publicGuard()],
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        canActivateChild: [privateGuard()],
        path: 'home',
        loadChildren: () => import('./pages/home-page/home-page.routes'),
      },
      { path: '**', redirectTo: '/home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
