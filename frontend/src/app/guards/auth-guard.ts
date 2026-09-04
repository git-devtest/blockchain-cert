import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    const rol = authService.usuarioActual()?.rol;
    const requiereAdmin = route.data?.['rol'] === 'admin';
    if (requiereAdmin && rol !== 'admin') {
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  return authService.perfil().pipe(
    map(usuario => {
      const rol = usuario.rol;
      const requiereAdmin = route.data?.['rol'] === 'admin';
      if (requiereAdmin && rol !== 'admin') {
        router.navigate(['/']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
