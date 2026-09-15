import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  isLoading: boolean = false;
  http: any;
  constructor(
    private fb: FormBuilder,
    private auth: AuthServiceService,
    private route : Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        CustomValidator.email()

        // Validators.checkEmail()
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }


  // login() {
  //   this.isLoading =true;
  //   if (this.loginForm.invalid) {
  //     this.loginForm.markAllAsTouched();
  //     return;
  //   }

  //   const { email, password } = this.loginForm.value;

  //   const isValid = this.auth.validateLogin(
  //     email,
  //     password
  //   );

  //   if (!isValid) {
  //     setTimeout(() => {
  //       this.isLoading = false;
  //       console.log('Invalid email or password');
  //     }, 200);
  //     return;
  //   }

  //   setTimeout(() => {
  //     this.isLoading = false;
  //      console.log('Login successful');
  //      this.route.navigate(['/dashboard']);
  //   }, 300);


  // }



login() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  const { email, password } = this.loginForm.value;

  this.auth.login(email, password).subscribe({
    next: (response) => {
      console.log('Login successful');
      console.log('JWT Token:', response.token);
      console.log('User:', response.user);

      // Store JWT
      this.auth.setToken(response.token);

      // Store user information
      this.auth.register(response.user);

      //testing
       this.auth.testProtectedApi().subscribe({
      next: (res) => {
        console.log('Protected API response:', res);
      },
      error: (err) => {
        console.error('Protected API error:', err);
      }
    });


      this.isLoading = false;

      this.route.navigate(['/dashboard']);
    },

    error: (error) => {
      console.error('Login failed:', error);

      this.isLoading = false;
    }
  });
}

}
