import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import{AuthServiceService,RegisteredUser} from '../../services/auth.service';
import { CustomValidator } from '../../../shared/customeValidators/custom-validator';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  user: RegisteredUser | null = null;showChangePassword = false;
isPasswordLoading : boolean = false;
passwordForm!: FormGroup;
  profileForm!: FormGroup;

  isEditMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.buildForm();
    this.buildPasswordForm();
  }

  private buildForm(): void {

    this.profileForm = this.fb.group({

      userName: [
        this.user?.userName || '',
        [
          Validators.required,
          Validators.minLength(3),
          CustomValidator.onlyAlphabets()
        ]
      ],

      emailId: [
        this.user?.emailId || '',
        [
          Validators.required,
          CustomValidator.email()
        ]
      ],

      state: [
        this.user?.state || '',
        Validators.required
      ],

      city: [
        this.user?.city || '',
        Validators.required
      ],

      address: [
        this.user?.address || ''
      ]

    });

  }

  private buildPasswordForm(): void {

  this.passwordForm = this.fb.group({

    currentPassword: [
      '',
      [
        Validators.required
      ]
    ],

    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],

    confirmPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]

  });

}
  getControl(controlName: string) {
    return this.profileForm.get(controlName);
  }

  editProfile(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;

    this.profileForm.patchValue({
      userName: this.user?.userName || '',
      emailId: this.user?.emailId || '',
      state: this.user?.state || '',
      city: this.user?.city || '',
      address: this.user?.address || ''
    });
  }

  saveProfile(): void {

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    if (!this.user) {
      return;
    }

    this.isLoading = true;

    const updatedUser: RegisteredUser = {
      ...this.user,
      ...this.profileForm.getRawValue()
    };

    this.auth.register(updatedUser);

    this.user = updatedUser;

    this.isLoading = false;
    this.isEditMode = false;

  }


  passwordControl(controlName: string) {
  return this.passwordForm.get(controlName);
}

cancelChangePassword(): void {

  this.passwordForm.reset();

  this.showChangePassword = false;

  this.isPasswordLoading = false;

}

changePassword(): void {

  if (this.passwordForm.invalid) {

    this.passwordForm.markAllAsTouched();

    return;
  }

  if (!this.user) {
    return;
  }

  const {
    currentPassword,
    newPassword,
    confirmPassword
  } = this.passwordForm.getRawValue();


  // Check current password

  if (currentPassword !== this.user.password) {

    this.passwordForm
      .get('currentPassword')
      ?.setErrors({
        invalidPassword: true
      });

    return;
  }


  // Check new password and confirm password

  if (newPassword !== confirmPassword) {

    this.passwordForm.setErrors({
      passwordMismatch: true
    });

    return;
  }


  this.isPasswordLoading = true;


  // Update password

  const updatedUser: RegisteredUser = {

    ...this.user,

    password: newPassword

  };


  this.auth.register(updatedUser);

  this.user = updatedUser;


  // Simulate successful operation

  setTimeout(() => {

    this.isPasswordLoading = false;

    this.passwordForm.reset();

    this.showChangePassword = false;

    console.log('Password changed successfully');

  }, 500);

}

}
