import { Directive, ElementRef, Renderer2, forwardRef } from '@angular/core';
import { RestnodeService } from '../servicios/restnode.service';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, catchError, last, map, of, take, tap } from 'rxjs';
import { IRestMessage } from '../modelos/restmessage';

@Directive({
  selector: '[appComprobacionexisteemail]',
  providers:[
    { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(()=>ComprobacionexisteemailDirective), multi:true }
  ]
})
export class ComprobacionexisteemailDirective implements AsyncValidator{

  constructor(private restSvc: RestnodeService, 
              private inputEmail: ElementRef,
              private render2: Renderer2) { }
  
  validate(control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    //fondo del input-Email en rojo hasta q validacion este OKS...y se ponga en verde
    if(control.value) this.render2.setAttribute(this.inputEmail.nativeElement,'style','background-color:#cfe2ff');

    return this.restSvc.ComprobarEmail(control.value).pipe(
      //operador-1 transformacion obs
      tap( (dato:IRestMessage)=> console.log('el servidor me ha devuelto esto...', dato) ),
      map( (dato:IRestMessage)=>{
          if (dato.codigo == 0) this.render2.setAttribute(this.inputEmail.nativeElement,'style','background-color:white');
          return dato.codigo == 0 ? null : { 'emailexiste': { codigo: dato.codigo, error: dato.error} }
      } ),
      catchError((error)=>of({'emailexiste':{ codigo:1, error } }) ),
      take(1)
    )
  }

}
