import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./parametros.component').then(m => m.ParametrosComponent),
    data: {
      title: `Usuarios`
    }
  }
];

