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
          title: 'Consolidaciones',
          servicetype: {id : 2, name: "maritimo"}
        }
      },
      {
        path: 'reempaque',
        loadComponent: () => import('./crud/crud.component').then(m => m.CrudComponent),
        data: {
          title: 'Reempaques',
          servicetype: {id : 1, name: "aereo"}
        }
      },
      {
        path: 'delivery',
        loadComponent: () => import('./reempaque/reempaque.component').then(m => m.ReempaqueComponent),
        data: {
          title: 'Por Tracking'
        }
      },
    ]
  }
];

