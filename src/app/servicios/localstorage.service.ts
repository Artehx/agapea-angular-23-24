import { Injectable } from '@angular/core';
import { IStorageService } from '../modelos/interfaceservicios';
import { ICliente } from '../modelos/cliente';
import { Observable, of } from 'rxjs';
import { ILibro } from '../modelos/libro';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService implements IStorageService {

  constructor() { }
  
  AlmacenarDatosCliente(datoscliente: ICliente): void {
   localStorage.setItem('datoscliente',JSON.stringify(datoscliente));
  }
  AlmacenarJWT(jwt: string): void {
    localStorage.setItem('jwt', jwt);
  }
  RecuperarDatosCliente(): Observable<ICliente> {
    let _datoscliente:ICliente=(JSON.parse( localStorage.getItem('datoscliente')! )) as ICliente;
    return of( _datoscliente );
  }
  RecuperarJWT(): Observable<string> {
    let _jwt=localStorage.getItem('jwt')!;
    return of(_jwt);
  }

  OperarElementosPedido(libro: ILibro, cantidad: number, operacion: string): void {
    throw new Error('Method not implemented.');
  }
  RecuperarElementosPedido(): Observable<{ libroElemento: ILibro; cantidadElemento: number; }[]> {
    throw new Error('Method not implemented.');
  }

}
