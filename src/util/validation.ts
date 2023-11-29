namespace App {
  // Validation interface
  export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

  // Validation function
  export function validate(ValidatableInpute: Validatable) {
    let isValid = true;
    if (ValidatableInpute.required) {
      isValid = isValid && ValidatableInpute.value.toString().trim().length !== 0;
    }
    if (
      ValidatableInpute.minLength != null && 
      typeof ValidatableInpute.value === 'string'
    ) {
      isValid = isValid && ValidatableInpute.value.length > ValidatableInpute.minLength;
    }
    if (
      ValidatableInpute.maxLength != null && 
      typeof ValidatableInpute.value === 'string'
    ) {
      isValid = isValid && ValidatableInpute.value.length < ValidatableInpute.maxLength;
    }
    if (ValidatableInpute.min != null && typeof ValidatableInpute.value === 'number') {
      isValid = isValid && ValidatableInpute.value > ValidatableInpute.min;
    }
    if (ValidatableInpute.max != null && typeof ValidatableInpute.value === 'number') {
      isValid = isValid && ValidatableInpute.value < ValidatableInpute.max;
    }
    return isValid;
  }

}

