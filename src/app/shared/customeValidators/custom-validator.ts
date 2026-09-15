
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RegexPattern } from './regex-pattern';

export class CustomValidator {
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
        return null;
      }

      return RegexPattern.EMAIL.test(value)
        ? null
        : { invalidEmail: true };
    };
  }

  static onlyAlphabets(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
        return null;
      }

      return RegexPattern.ONLY_ALPHABETS.test(value)
        ? null
        : { onlyAlphabets: true };
    };
  }

  static onlyNumbers(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
        return null;
      }

      return RegexPattern.ONLY_NUMBERS.test(value)
        ? null
        : { onlyNumbers: true };
    };
  }

}
