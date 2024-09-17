import { Injectable } from '@angular/core';
import { IStorageService } from '../modelos/interfaceservicios';
import { ICliente } from '../modelos/cliente';
import { BehaviorSubject, Observable, last } from 'rxjs';
import { ILibro } from '../modelos/libro';
import { IList } from '../modelos/list';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectstorageService implements IStorageService{

  private _clienteSubject$:BehaviorSubject<ICliente | null >=new BehaviorSubject<ICliente | null>( null );
  private _jwtSubject$:BehaviorSubject<string>=new BehaviorSubject<string>( '' );
  private _elementosPedidoSubject$:BehaviorSubject<Array<{ libroElemento:ILibro, cantidadElemento:number}>> = new BehaviorSubject<Array<{ libroElemento:ILibro, cantidadElemento:number}>>( [] );
  

  private _elementosPedido:{ libroElemento:ILibro, cantidadElemento:number}[]=[];
  
  constructor() {
    //...puedes ahorrarte esta subscripcion y la variable interna privada donde almacenas los elementos del pedido: _elementosPedido
    //usando prop. de los BehaviourSubject   .value <--- recuperas ultimo valor del observalble del subject
    this._elementosPedidoSubject$.asObservable().subscribe(elementos => this._elementosPedido=elementos);
   }
 
  OperarElementosPedido(libro: ILibro, cantidad: number, operacion: string): void {

    let _posElem:number=this._elementosPedido.findIndex( el=> el.libroElemento.ISBN13 === libro.ISBN13);

    switch (operacion) {
      case "añadir":
        if (_posElem != -1) {
            //el libro existe ya, incremento cantidad...
            this._elementosPedido[_posElem].cantidadElemento += cantidad;
        } else {
          //libro no existe, añado nuevo elemento pedido...
          this._elementosPedido.push({libroElemento: libro, cantidadElemento: 1})
        }
        break;

      case "borrar":
        if (_posElem != -1 ) this._elementosPedido=this._elementosPedido.filter((elem)=>elem.libroElemento.ISBN13 !== libro.ISBN13);
        break;

      case "modificar":
        if (_posElem != -1 ) this._elementosPedido[_posElem].cantidadElemento=cantidad;            
        break;

      default:
        break;
    }
    
    console.log('lista elementos pedido actualizada....', this._elementosPedido);
    this._elementosPedidoSubject$.next(this._elementosPedido);
    
  }
  RecuperarElementosPedido(): Observable<Array<{ libroElemento:ILibro, cantidadElemento:number}>> {
    return this._elementosPedidoSubject$.asObservable();
  }

  AlmacenarDatosCliente(datoscliente: ICliente): void {
    this._clienteSubject$.next(datoscliente);
  }

  AlmacenarListas(newlists : IList[]) : void {
   // console.log("Listas en 'Almacenar listas' -> ", newlists);
    let clientData = this._clienteSubject$.value;
   
    if(clientData){

      const newClient : ICliente = {
        ...clientData!,
        lists: newlists
      };

      this._clienteSubject$.next(newClient);
    } else {

      console.log('Fallo al actualizar listas')

    }
  

  }

  AlmacenarJWT(jwt: string): void {
    this._jwtSubject$.next(jwt);
  }
  RecuperarDatosCliente(): Observable<ICliente | null> {
    return this._clienteSubject$.asObservable();
  }

  RecuperarClientValue(): ICliente {
    
   const clientData = this._clienteSubject$.value;
   return clientData!;


  }

  
  RecuperarClientLists(): Observable<Array<IList>> {

    const clientData = this._clienteSubject$.value;

    const listsObservable : Array<IList> = clientData?.lists  ?? [];

    return of(listsObservable);
  
  }

  RecuperarClienteList(idlist: string) : IList | undefined {

    const clientData = this._clienteSubject$.value;
   
    const listSearched : IList | undefined = clientData!.lists?.find(ev => ev.idList === idlist);
    //este método devuelve el primer elemento que cumple con la condición, o undefined si 
    //no encuentra ninguno
    
    return listSearched;
    
  }

  RecuperarJWT(): Observable<string> {
    return this._jwtSubject$.asObservable();
  }
}
