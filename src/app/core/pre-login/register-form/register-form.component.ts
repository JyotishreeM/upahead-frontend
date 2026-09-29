import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { formConfig } from '../../../models/formModel';
import { globalConstans } from '../../../global-constants';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth.service';
import {
  LocationService,
  State,
  City
} from '../../services/location.service';

import { of } from 'rxjs';
import { switchMap, catchError, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent implements OnInit {
  formFields: formConfig[] = globalConstans.customerFormConfig as formConfig[];
  isLoading: boolean = false;
  customerForm !: FormGroup;
  formBuilder = inject(FormBuilder);
  private locationService = inject(LocationService);
  states: State[] = [];
  cities: City[] = [];

  constructor(
    private auth: AuthServiceService,
    private route: Router,
  ) {
    this.customerForm = this.initializeForm();
    console.log(this.customerForm.value)
  }



  ngOnInit(): void {
    this.loadStates();

    this.customerForm.get('state')?.valueChanges.pipe(
      distinctUntilChanged(),

      switchMap((stateName: string) => {
        // Reset the city whenever the state changes.
        this.customerForm.get('city')?.reset('');
        this.cities = [];
        this.updateDropdownOptions('city', []);

        const selectedState = this.states.find(
          state => state.stateName === stateName
        );

        if (!selectedState) {
          return of([] as City[]);
        }

        return this.locationService
          .getCities(selectedState.stateId)
          .pipe(
            catchError(error => {
              console.error('Failed to load cities:', error);
              return of([] as City[]);
            })
          );
      })
    ).subscribe((response: City[]) => {
      this.cities = response;

      this.updateDropdownOptions(
        'city',
        response.map(city => city.cityName)
      );
    });
  }


  loadStates(): void {
    this.locationService.getStates().subscribe({
      next: (response) => {
        this.states = response;

        this.updateDropdownOptions(
          'state',
          response.map(state => state.stateName)
        );
      },
      error: (error) => {
        console.error('Failed to load states:', error);
      }
    });
  }

  loadCities(stateId: number): void {
    this.locationService.getCities(stateId).subscribe({
      next: (response) => {
        this.cities = response;

        this.updateDropdownOptions(
          'city',
          response.map(city => city.cityName)
        );
      },
      error: (error) => {
        console.error('Failed to load cities:', error);
      }
    });
  }

  updateDropdownOptions(
    fieldName: string,
    options: string[]
  ): void {
    this.formFields = this.formFields.map(field =>
      field.name === fieldName
        ? { ...field, option: options }
        : field
    );
  }



  initializeForm() {
    const formGroup: any = {};
    for (const field of this.formFields) {
      formGroup[field.name] = [field.initialValue, field.validatorFun.length != 0 ? field.validatorFun : []]
    }
    return this.formBuilder.group(formGroup)
  }

  trackByFn(index: number, item: any) {
    return index;
  }

  getControl(controlName: string): AbstractControl | null {
    return this.customerForm.get(controlName);
  }


  onSave(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    if (this.isLoading) return;
    this.isLoading = true;

    const formValue = this.customerForm.getRawValue();

    const userData = {
      userName: formValue.userName.trim(),
      emailId: formValue.emailId.trim(),
      password: formValue.password,
      state: formValue.state,
      city: formValue.city,
      address: formValue.address
    };

    this.auth.registerUser(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful:', response.userId);
        this.route.navigate(['/login']);
      },

      error: (error) => {
        this.isLoading = false;
        const errorMessage =
          error.error?.error || 'Registration failed. Please try again.';
        alert(errorMessage);
      }
    });
  }

}
