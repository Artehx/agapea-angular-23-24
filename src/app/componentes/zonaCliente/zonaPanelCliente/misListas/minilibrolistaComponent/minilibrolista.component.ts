import { Component, Input } from '@angular/core';
import { ILibro } from '../../../../../modelos/libro';

@Component({
  selector: 'app-minilibrolista',
  templateUrl: './minilibrolista.component.html',
  styleUrl: './minilibrolista.component.css'
})
export class MinilibrolistaComponent {
  public showTextComment:boolean=false;

  @Input() bookDetails!: ILibro;



}
