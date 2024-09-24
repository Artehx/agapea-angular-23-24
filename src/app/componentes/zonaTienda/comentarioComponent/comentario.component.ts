import { Component, Input } from '@angular/core';
import { IComment } from '../../../modelos/comment';
import { DatePipe } from '@angular/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrl: './comentario.component.css',
  providers: [DatePipe]
})
export class ComentarioComponent {

  @Input() comentario! : IComment;
  
  constructor(private datePipe: DatePipe){}

  formatDate(fecha: Date): string {
    return format(fecha, "d 'de' MMMM 'del' yyyy", { locale: es }); 
  }
  }



