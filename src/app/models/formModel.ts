import { ValidatorFn } from "@angular/forms";

export interface formConfig {
  name: string,
  label:string,
  isHidden:boolean,
  placeholder:string,
  type:string,
  option:any[],
  validatorFun : ValidatorFn[],
  initialValue : string,
  width:string,

}

//  { name: 'isActive', label: 'Select Status', isHidden: false, placeholder: '', type: 'checkbox', option: [], validatorFun: [] },
