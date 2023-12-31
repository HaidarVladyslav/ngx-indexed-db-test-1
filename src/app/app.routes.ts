import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'people', loadComponent: () => import('./people/people.component') },
  { path: '', redirectTo: '/people', pathMatch: 'full' }
];
