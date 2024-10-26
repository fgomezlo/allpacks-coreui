import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cliente.component').then(m => m.ClienteComponent),
    data: {
      title: `Clientes`
    }
  }
];

