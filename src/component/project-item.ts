import { Draggable } from '../models/drag-drop.js';
import { Project } from '../models/project.js';
import { Component } from './base-component.js';
import { autobind } from '../decorators/autobind.js';

// ProjectItem class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;
  
  get persons() {
    if(this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostID: string, project: Project) {
    super('single-project', hostID, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_: DragEvent) {
    console.log('DragEnd');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + " assigned"; //this.personsは直接getterを使用、（）をつけるのは不要
    this.element.querySelector('p')!.textContent = this.project.discription;
  }
}