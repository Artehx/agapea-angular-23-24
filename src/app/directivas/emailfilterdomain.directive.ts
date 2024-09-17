import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appEmailfilterdomain]',
  providers:[
    //para q la directiva actue como un validador SINCRONO en un atributo de un elemento del dom en un TEMPLATE-FORM, tengo q definirla como inyectable en servicios de validacion
    { provide: NG_VALIDATORS, useExisting: EmailfilterdomainDirective, multi:true }
  ]
})
export class EmailfilterdomainDirective implements Validator {
  @Input() dominiosvalidos:string[]=[];
  
  //en una directiva puedes inyectar en el constructor una referencia al elemento del DOM sobre el q se aplica, el tipo de dato: ElementRef
  //inyecto instancia servicio Render2 <----- otorga props/metodos para modificar elementos del DOM desde codigo
  constructor( private inputEmail:ElementRef, private render2: Renderer2) { }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    //metodo q se ejecuta cada vez q el contenido del elemnto del DOM cambia (en nuestro caso el input-email)
    //si el metodo devuelve null <--- validacion correcta, 
    //si devuelve objeto ValidationErrors: { 'clave-error': valor } <--- validacion invalida, este objeto apareceria en .errors del formControl

    //por defecto ponemos color de fondo rojo:
    if (control.value) this.render2.setAttribute(this.inputEmail.nativeElement,'style','background-color: #cfe2ff');

    //console.log('valor de caja....', control.value);

    if (control.value && (control.value as string).indexOf('@')) {
      let _dombuscar=(control.value as string).split('@')[1].split('.')[0]; // control.value="mio@dominio.es" <--- devuelvo desde la @ al .
      
      //return this.dominiosvalidos.some( dom=> dom ===_dombuscar) ?  null   :  { 'emailfilterdoms': {'mensaje': 'dominio invalidoi de email', 'validos': this.dominiosvalidos} } ;
      if (this.dominiosvalidos.some( dom=> dom ===_dombuscar)) {
        this.render2.setAttribute(this.inputEmail.nativeElement,'style','background-color: white');
        return null;
      } else {
        return { 
                'emailfilterdoms': {
                                    'mensaje': 'dominio invalidoi de email',
                                    'validos': this.dominiosvalidos
                                  } 
              };
      }
    
    
    } else {
      return null;
      
    }
  }

}
