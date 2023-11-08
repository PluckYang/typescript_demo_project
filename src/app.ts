class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    // <HTMLTemplateElement>で document.getElementById から取得したelement種類を定義
    // 或いは this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
    this.hostElement = <HTMLDivElement>document.getElementById('app')!;
    
    // htmlファイル内の<template>のreferenceを取得
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = <HTMLFormElement>importedNode.firstElementChild;
    this.attach;
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}