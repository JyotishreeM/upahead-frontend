import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


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

export interface RegistrationRequest {
  userName: string;
  emailId: string;
  password: string;
  state: string;
  city: string;
  address: string;
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
  private readonly API_URL = `${environment.apiUrl}/api/auth`;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient,
  ) { }

  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = {
      email,
      password
    };

    return this.http.post<LoginResponse>(
      `${this.API_URL}/login`,
      loginRequest
    );
  }

  registerUser(
    user: RegistrationRequest
  ): Observable<RegisteredUser> {
    return this.http.post<RegisteredUser>(
      `${this.API_URL}/register`,
      user
    );
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

  // validateLogin(
  //   email: string,
  //   password: string
  // ): boolean {

  //   const user = this.getUser();

  //   if (!user) {
  //     return false;
  //   }

  //   return (
  //     user.emailId === email &&
  //     user.password === password
  //   );
  // }

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
      `${environment.apiUrl}/api/test/protected`,
      {
        responseType: 'text'
      }
    );
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (!payload.exp) {
        return true;
      }
      const expiryTime = payload.exp * 1000;
      return Date.now() >= expiryTime;
    } catch {
      return true;
    }
  }

}
