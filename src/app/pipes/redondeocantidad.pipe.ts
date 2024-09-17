import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'redondeocantidad'
})
export class RedondeocantidadPipe implements PipeTransform {
//pipe usada para redondeo de valores numericos, como parametro tiene el numero de decimales
//q quieres redondear
// { valor | redondeacantidad:4 }
  
transform(value: number, numeroDecimales:number=2): number {
    //console.log('valor pasado y numero de decimales...', { value, numeroDecimales});
    
    //si usas value.toFixed(numeroDecimales) <---- devuelve un string, no un number....
    return Math.round(value* 10**numeroDecimales)/10**numeroDecimales;
  }

}
