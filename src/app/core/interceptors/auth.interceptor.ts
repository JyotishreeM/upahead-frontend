import { HttpInterceptorFn } from '@angular/common/http';
import { AuthServiceService } from '../services/auth.service';
import { inject } from '@angular/core';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthServiceService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);

};
