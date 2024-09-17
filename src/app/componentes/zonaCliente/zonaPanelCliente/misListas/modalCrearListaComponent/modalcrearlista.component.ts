import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IList } from '../../../../../modelos/list';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modalcrearlista',
  templateUrl: './modalcrearlista.component.html',
  styleUrl: './modalcrearlista.component.css'
})
export class ModalcrearlistaComponent {

  @Input() list!: IList;
  @Output() createList = new EventEmitter<IList>();

  //No lo uso...
  public formLists!: FormGroup;

  constructor(){

  }

   createNewList() {

    this.createList.emit(this.list)
    console.log("Mi nueva lista enviada al padre: ", this.list)

  }



}
