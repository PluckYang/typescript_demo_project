// Drag & Drop Interfaces
interface Draggable { //対象はは画面上各ProjectItem
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget { //対象は画面上、activeとfinished projectsを表示用のbox
  dragOverHandler(event: DragEvent): void;  //移動先の画面範囲を設置
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;  //動作中、ユーザへの画面フィードバックを提供
}

// Project Type
enum ProjectStatus {
  Active,
  Finished
}

class Project {
  constructor(
    public id:string, 
    public title:string, 
    public discription:string, 
    public people: number, 
    public status: ProjectStatus) {

  }
}

//Project State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
  // protectedはprivateほぼ同じ、だが継承class内からのアクセスを許可
  protected listeners: Listener<T>[] = [];

  addListener(ListenerFn: Listener<T>) {
    this.listeners.push(ListenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  // projectのStateを固定させる、staticで宣言
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople, 
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

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

// Component Base Class, can`t instantiate
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string, 
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string,
  ) {
    this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)!;
    this.hostElement = <T>document.getElementById(hostElementId)!;

    const importedNode = document.importNode(
      this.templateElement.content, 
      true
    );
    this.element = <U>importedNode.firstElementChild;
    if(newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBegining: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBegining ? 'afterbegin' : 'beforebegin', 
      this.element
    );
  }

  abstract configure(): void;

  abstract renderContent():void;
}

// ProjectItem class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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
    console.log(event);
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


// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];
    
    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.add('droppable');
  }

  dropHandler(_: DragEvent) {
    
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter(prj => {
        if(this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = projects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = 
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-project-list`) as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
    }
  }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const prjInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');