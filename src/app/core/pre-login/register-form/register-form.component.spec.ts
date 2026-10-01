import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { RegisterFormComponent } from './register-form.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { AuthServiceService } from '../../services/auth.service';
import { authInterceptor } from '../../interceptors/auth.interceptor';
import { environment } from '../../../../environments/environment';

describe('Registration and login flow', () => {
  let component: RegisterFormComponent;
  let http: HttpTestingController;
  let auth: AuthServiceService;
  let navigate: jasmine.Spy;
  const api = environment.apiUrl;
  const user = {
    userId: 10, userName: 'Test User', emailId: 'test@example.com',
    state: 'Karnataka', city: 'Bengaluru', address: '', isActive: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterFormComponent, LoginFormComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthServiceService);
    spyOn(auth, 'getToken').and.returnValue('stale-token');
    spyOn(auth, 'register');
    spyOn(auth, 'setToken');
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    component = TestBed.createComponent(RegisterFormComponent).componentInstance;
    component.customerForm.patchValue({
      userName: 'Test User', emailId: 'test@example.com', password: 'Test!12345',
      state: 'Karnataka', city: 'Bengaluru', address: ''
    });
  });

  afterEach(() => http.verify());

  it('creates an account through the API before allowing navigation to login', () => {
    component.onSave();
    const request = http.expectOne(`${api}/api/auth/register`);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.has('Authorization')).toBeFalse();
    expect(request.request.body).toEqual({
      userName: 'Test User', emailId: 'test@example.com', password: 'Test!12345',
      state: 'Karnataka', city: 'Bengaluru', address: ''
    });
    expect(navigate).not.toHaveBeenCalled();
    expect(auth.register).not.toHaveBeenCalled();
    request.flush(user);
    expect(navigate).toHaveBeenCalledWith(['/login']);
    expect(component.isLoading).toBeFalse();
  });

  it('shows registration failures and permits retry without navigating', () => {
    component.onSave();
    http.expectOne(`${api}/api/auth/register`).flush({}, { status: 409, statusText: 'Conflict' });
    expect(component.errorMessage).toContain('already exists');
    expect(component.isLoading).toBeFalse();
    expect(navigate).not.toHaveBeenCalled();
    component.onSave();
    expect(component.errorMessage).toBe('');
    http.expectOne(`${api}/api/auth/register`).flush(user);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('does not submit invalid forms or duplicate in-flight registrations', () => {
    component.customerForm.patchValue({ password: '' });
    component.onSave();
    http.expectNone(`${api}/api/auth/register`);
    expect(component.isLoading).toBeFalse();
    component.customerForm.patchValue({ password: 'Test!12345' });
    component.onSave();
    component.onSave();
    http.expectOne(`${api}/api/auth/register`).flush(user);
  });

  it('logs in without a stale token and saves the successful session', () => {
    const login = TestBed.createComponent(LoginFormComponent).componentInstance;
    login.loginForm.setValue({ email: 'test@example.com', password: 'Test!12345' });
    login.login();
    const request = http.expectOne(`${api}/api/auth/login`);
    expect(request.request.headers.has('Authorization')).toBeFalse();
    expect(request.request.body).toEqual({ email: 'test@example.com', password: 'Test!12345' });
    request.flush({ token: 'new-token', user });
    expect(auth.setToken).toHaveBeenCalledWith('new-token');
    expect(auth.register).toHaveBeenCalledWith(user);
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(login.isLoading).toBeFalse();
  });

  it('shows rejected login without saving a session', () => {
    const login = TestBed.createComponent(LoginFormComponent).componentInstance;
    login.loginForm.setValue({ email: 'test@example.com', password: 'Test!12345' });
    login.login();
    http.expectOne(`${api}/api/auth/login`).flush({}, { status: 403, statusText: 'Forbidden' });
    expect(login.errorMessage).toContain('rejected');
    expect(login.isLoading).toBeFalse();
    expect(auth.setToken).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('omits tokens for signup locations and external URLs but authenticates protected API calls', () => {
    const client = TestBed.inject(HttpClient);
    for (const url of [`${api}/api/locations/states`, `${api}/api/locations/states/2/cities`, 'https://example.com/data']) {
      client.get(url).subscribe();
      const request = http.expectOne(url);
      expect(request.request.headers.has('Authorization')).toBeFalse();
      request.flush([]);
    }
    client.get(`${api}/api/test/protected`).subscribe();
    const protectedRequest = http.expectOne(`${api}/api/test/protected`);
    expect(protectedRequest.request.headers.get('Authorization')).toBe('Bearer stale-token');
    protectedRequest.flush({});
  });
});