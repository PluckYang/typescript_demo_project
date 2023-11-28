// Drag & Drop Interfaces
namespace App {
  //exportでこのinterfaceがDDInterfaces外部にも使用できるようにする
  export interface Draggable { //対象はは画面上各ProjectItem
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
  }

  export interface DragTarget { //対象は画面上、activeとfinished projectsを表示用のbox
    dragOverHandler(event: DragEvent): void;  //移動先の画面範囲を設置
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;  //動作中、ユーザへの画面フィードバックを提供
  }
}

