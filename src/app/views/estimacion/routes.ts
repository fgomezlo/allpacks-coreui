import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./estimacion.component').then(m => m.EstimacionComponent),
    data: {
      title: `Estimación de la carga`
    }
  }
];

