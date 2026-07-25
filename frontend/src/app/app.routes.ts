import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'certificar',
    pathMatch: 'full'
  },
  {
    path: 'certificar',
    loadComponent: () =>
      import('./components/certificar/certificar').then(m => m.CertificarComponent)
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
    path: 'historial',
    loadComponent: () =>
      import('./components/historial/historial').then(m => m.HistorialComponent)
  },
  {
    path: 'identificador',
    loadComponent: () =>
      import('./components/identificador/identificador').then(m => m.IdentificadorComponent)
  },
  {
    path: 'consultar/:codigo',
    loadComponent: () =>
      import('./components/verificar/verificar').then(m => m.VerificarComponent)
  },
];
