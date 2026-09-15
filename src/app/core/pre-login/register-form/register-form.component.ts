import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { formConfig } from '../../../models/formModel';
import { globalConstans } from '../../../global-constants';
import { CommonModule } from '@angular/common';
import { RouterLink,Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth.service';


@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  formFields: formConfig[] = globalConstans.customerFormConfig as formConfig[];
  isLoading : boolean = false;
  customerForm !: FormGroup;
  formBuilder = inject(FormBuilder)

  constructor(
    private auth: AuthServiceService,
    private route : Router
  ){
   this.customerForm =  this.initializeForm();
   console.log(this.customerForm.value)
  }
  initializeForm(){
    const formGroup:any = {};
    for(const field of this.formFields){
      formGroup[field.name] = [field.initialValue,field.validatorFun.length !=0 ?field.validatorFun : []]
    }
    return this.formBuilder.group(formGroup)
  }

  trackByFn(index: number, item: any){
    return index;
  }

  getControl(controlName:string):AbstractControl | null{
    return this.customerForm.get(controlName);
  }

onSave(): void {
  this.isLoading = true;
  if (this.customerForm.invalid) {
    this.customerForm.markAllAsTouched();
    return;
  }

  const userData = this.customerForm.value;

  this.auth.register(userData);
  setTimeout(() => {
     console.log('Registration successful');
     this.route.navigate(['/login']);
     this.isLoading = false;
  }, 500);



}
}
