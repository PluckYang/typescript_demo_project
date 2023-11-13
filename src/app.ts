// Validation interface
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// Validation function
function validate(ValidatableInpute: Validatable) {
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

// autobind decorator
function autobind(
  //"_"で定義されたが、使われてい無いparameterを表示
  _: any, 
  _2: string, 
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get () {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;
}

// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // <HTMLTemplateElement>で document.getElementById から取得したelement種類を定義
    // 或いは this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
    this.hostElement = <HTMLDivElement>document.getElementById('app')!;
    
    // htmlファイル内の<template>のreferenceを取得
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = <HTMLFormElement>importedNode.firstElementChild;
    this.element.id = 'user-input';

    this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title');
    this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description');
    this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people');

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
        alert('Invalid input, please try again!');
        return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
    // デフォルトのHTML requestを避ける
    event.preventDefault();
    const userInpute = this.gatherUserInput();
    if (Array.isArray(userInpute)) {
      const [title, desc, people] = userInpute;
      console.log(title, desc, people);
      this.clearInputs();
    }    
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}