import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { CustomValidator } from '../../../shared/customeValidators/custom-validator';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthServiceService,
    private route: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, CustomValidator.email()]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.isLoading) return;
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).pipe(
      finalize(() => { this.isLoading = false; })
    ).subscribe({
      next: response => {
        this.auth.setToken(response.token);
        this.auth.register(response.user);
        this.route.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Sign-in was rejected. Check your credentials and that your account has been created and enabled.';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please try again later.';
        } else {
          this.errorMessage = 'Unable to sign in. Please try again later.';
        }
      }
    });
  }
}