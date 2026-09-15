import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface RegisteredUser {
  userId: number;
  userName: string;
  emailId: string;
  state: string;
  city: string;
  address: string;
  isActive: boolean;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: RegisteredUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private readonly USER_KEY = 'registeredUser';
  private readonly TOKEN_KEY = 'accessToken';
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) { }

  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email, password };

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginRequest);
  }

  register(user: RegisteredUser): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.localStorage.setItem(
      this.USER_KEY,
      JSON.stringify(user)
    );
  }

  getUser(): RegisteredUser | null {

    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const user = window.localStorage.getItem(this.USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as RegisteredUser;
    } catch (error) {
      console.error('Invalid user data in localStorage', error);
      return null;
    }
  }

  validateLogin(
    email: string,
    password: string
  ): boolean {

    const user = this.getUser();

    if (!user) {
      return false;
    }

    return (
      user.emailId === email &&
      user.password === password
    );
  }

 logout(): void {
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  window.localStorage.removeItem(this.USER_KEY);
  window.localStorage.removeItem(this.TOKEN_KEY);
}

  getToken(): string | null {
  if (!isPlatformBrowser(this.platformId)) {
    return null;
  }

  return window.localStorage.getItem(this.TOKEN_KEY);
}

  setToken(token: string): void {
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  window.localStorage.setItem(this.TOKEN_KEY, token);
}


  testProtectedApi() {
  return this.http.get(
    'http://localhost:8080/api/test/protected',
    {
      responseType: 'text'
    }
  );
}

}
