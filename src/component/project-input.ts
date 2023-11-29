/// <reference path="base-component.ts"/>
/// <reference path="../util/validation.ts"/>
/// <reference path="../decorators/autobind.ts"/>
/// <reference path="../state/project-state.ts"/>

namespace App {
  // ProjectInput Class
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super('project-input', 'app', true, 'user-input');
      this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title');
      this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description');
      this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people');  
      this.configure();
    }
    
    configure() {
      this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent() {}

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
        projectState.addProject(title, desc, people);
        this.clearInputs();
      }    
    }
  }
}