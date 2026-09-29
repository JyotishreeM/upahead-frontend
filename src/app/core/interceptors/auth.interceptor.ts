import { HttpInterceptorFn } from '@angular/common/http';
import { AuthServiceService } from '../services/auth.service';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBase = environment.apiUrl.replace(/\/$/, '');
  const requestPath = req.url.split(/[?#]/)[0].replace(/\/$/, '');
  const isApiRequest = requestPath.startsWith(`${apiBase}/`);
  const isPublicAuthRequest = [`${apiBase}/api/auth/login`, `${apiBase}/api/auth/register`]
    .includes(requestPath);
  if (!isApiRequest || isPublicAuthRequest) {
    return next(req);
  }
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
