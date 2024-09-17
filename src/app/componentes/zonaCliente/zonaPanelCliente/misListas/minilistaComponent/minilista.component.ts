import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IList } from '../../../../../modelos/list';

@Component({
  selector: 'app-minilista',
  templateUrl: './minilista.component.html',
  styleUrl: './minilista.component.css'
})
export class MinilistaComponent {

  @Input() listToPaint!: IList;

  constructor(private router:Router){ 


  }

  IrADetallesLista(){
    console.log('vamos a destalles lista...');
    this.router.navigateByUrl(`/Cliente/Panel/DetallesLista?idlista=${this.listToPaint.idList}`);
  }
}
