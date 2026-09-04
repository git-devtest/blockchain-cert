import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'certificar',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'cambiar-password/:token',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'certificar',
    loadComponent: () =>
      import('./components/certificar/certificar').then(m => m.CertificarComponent),
    canActivate: [authGuard]
  },
  {
    path: 'verificar',
    loadComponent: () =>
      import('./components/verificar/verificar').then(m => m.VerificarComponent)
  },
  {
    path: 'verificar/:hash',
    loadComponent: () =>
      import('./components/verificar/verificar').then(m => m.VerificarComponent)
  },
  {
    path: 'consultar/:codigo',
    loadComponent: () =>
      import('./components/verificar/verificar').then(m => m.VerificarComponent)
  },
  {
    path: 'historial',
    loadComponent: () =>
      import('./components/historial/historial').then(m => m.HistorialComponent),
    canActivate: [authGuard]
  },
  {
    path: 'identificador',
    loadComponent: () =>
      import('./components/identificador/identificador').then(m => m.IdentificadorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./components/perfil/perfil').then(m => m.Perfil),
    canActivate: [authGuard]
  },
  {
    path: 'admin/auditoria',
    loadComponent: () =>
      import('./components/admin/auditoria/auditoria').then(m => m.Auditoria),
    canActivate: [authGuard],
    data: { rol: 'admin' }
  },
  {
    path: 'admin/usuarios',
    loadComponent: () =>
      import('./components/admin/usuarios/usuarios').then(m => m.Usuarios),
    canActivate: [authGuard],
    data: { rol: 'admin' }
  }
];
