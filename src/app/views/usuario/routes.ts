import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./usuario.component').then(m => m.UsuarioComponent),
    data: {
      title: `Usuarios`
    }
  }
];

