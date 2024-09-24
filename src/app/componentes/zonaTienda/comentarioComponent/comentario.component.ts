import { Component, Input } from '@angular/core';
import { IComment } from '../../../modelos/comment';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrl: './comentario.component.css'
})
export class ComentarioComponent {

  @Input() comentario! : IComment;



}
