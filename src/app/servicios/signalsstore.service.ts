import { Injectable, signal } from '@angular/core';
import { IStorageService } from '../modelos/interfaceservicios';
import { Observable } from 'rxjs';
import { ICliente } from '../modelos/cliente';
import { ILibro } from '../modelos/libro';

@Injectable({
  providedIn: 'root'
})
export class SignalsstoreService implements IStorageService{
 
  private clienteSignal=signal<ICliente|null>(null);
  private jwtSignal=signal<string>("");
  private itemsSignal=signal<Array<{libroElemento:ILibro, cantidadElemento:number}>>([]);
 
  constructor() { }
  AlmacenarDatosCliente(datoscliente: ICliente): void {
    this.clienteSignal.update(()=> datoscliente);
  }

  AlmacenarJWT(jwt: string): void {
    this.jwtSignal.update(()=> jwt);
  }
  
  RecuperarDatosCliente(): Observable<ICliente | null> | ICliente | null  {
    return this.clienteSignal();
  }

  RecuperarJWT(): Observable<string> | string{
    return this.jwtSignal();
  }

  OperarElementosPedido(libro: ILibro, cantidad: number, operacion: string): void {
    this.itemsSignal.update(
      items => {
                let _posElem:number=items.findIndex( el=> el.libroElemento.ISBN13 === libro.ISBN13);

                switch (operacion) {
                  case "añadir":
                    if (_posElem != -1) {
                        //el libro existe ya, incremento cantidad...
                        items[_posElem].cantidadElemento += cantidad;
                    } else {
                      //libro no existe, añado nuevo elemento pedido...
                      items.push({libroElemento: libro, cantidadElemento: 1})
                    }
                    break;
            
                  case "borrar":
                    if (_posElem != -1 ) items=items.filter((elem)=>elem.libroElemento.ISBN13 !== libro.ISBN13);
                    break;
            
                  case "modificar":
                    if (_posElem != -1 ) items[_posElem].cantidadElemento=cantidad;            
                    break;
            
                  default:
                    break;
                }
                return items;    
      }
    );
  }


  RecuperarElementosPedido(): Observable<Array<{ libroElemento: ILibro; cantidadElemento: number; }>> | Array<{ libroElemento: ILibro; cantidadElemento: number; }> {
    return this.itemsSignal();
  }
}
