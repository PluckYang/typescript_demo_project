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

  @autobind
  private submitHandler(event: Event) {
    // デフォルトのHTML requestを避ける
    event.preventDefault();
    console.log(this.titleInputElement.value);
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}