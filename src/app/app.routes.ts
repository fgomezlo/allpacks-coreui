import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Dashboard - AllpacksFC'
    },
    canActivate : [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'usuario',
        loadChildren: () => import('./views/usuario/routes').then((m) => m.routes)
      },
      {
        path: 'cliente', 
        loadChildren: () => import('./views/cliente/routes').then((m) => m.routes)
      },
      {
        path: 'consolidacion',
        loadChildren: () => import('./views/consolidacion/routes').then((m) => m.routes)
      },
      {
        path: 'parametros',
        loadChildren: () => import('./views/parametros/routes').then((m) => m.routes)
      },
      {
        path: 'estimacion',
        loadChildren: () => import('./views/estimacion/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Autenticación de Usuario'
    }
  },
  {
    path: 'passrecovery/:passtoken',
    loadComponent: () => import('./views/pages/passrecovery/passrecovery.component').then(m => m.PassrecoveryComponent),
    data: {
      title: 'Reestablecer Contraseña'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
