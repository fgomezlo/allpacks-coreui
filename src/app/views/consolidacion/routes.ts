import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Consolidacion'
    },
    children: [
      {
        path: '',
        redirectTo: 'consultar',
        pathMatch: 'full'
      },
      {
        path: 'consultar',
        loadComponent: () => import('./crud/crud.component').then(m => m.CrudComponent),
        data: {
          title: 'Consultar'
        }
      },
      {
        path: 'reempaque',
        loadComponent: () => import('./reempaque/reempaque.component').then(m => m.ReempaqueComponent),
        data: {
          title: 'Por Tracking'
        }
      },
    ]
  }
];

