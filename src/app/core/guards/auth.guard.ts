import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  const token = authService.getToken();

    if (token){
  // if (token && !authService.isTokenExpired()) {
    return true;
  }
  // authService.logout();
  return router.createUrlTree(['/login']);
};
