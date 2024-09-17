import { Component, Inject } from '@angular/core';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservices';
import { IStorageService } from '../../../modelos/interfaceservicios';
import { ILibro } from '../../../modelos/libro';
import { Observable, lastValueFrom, map, mergeMap } from 'rxjs';
import { IProvincia } from '../../../modelos/provincia';
import { RestnodeService } from '../../../servicios/restnode.service';
import { IDatosPago } from '../../../modelos/datospago';
import { IPedido } from '../../../modelos/pedido';
import { ICliente } from '../../../modelos/cliente';

@Component({
  selector: 'app-mostrarpedido',
  templateUrl: './mostrarpedido.component.html',
  styleUrl: './mostrarpedido.component.css'
})
export class MostrarpedidoComponent {

  public listaItems$!:Observable<Array<{libroElemento:ILibro, cantidadElemento:number}>>;
  
  public subTotal$!:Observable<number>;
  public gastosEnvio:number=2; //dependera de provincia de direccion envio q esta en objeto datosPago y bla bla bla...

  public listaProvincias$!:Observable<IProvincia[]>;
  public showcompdatosfacturacion:boolean=false;
  public datosPago:IDatosPago={  tipodireccionenvio:'principal', tipoDireccionFactura: 'igualenvio', metodoPago:'tarjeta' };

   constructor( @Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService,
                private restSvc:RestnodeService ){
      this.listaItems$=storageSvc.RecuperarElementosPedido() as Observable<Array<{libroElemento:ILibro, cantidadElemento:number}>>;
      this.subTotal$=this.listaItems$.pipe(
                                          map(
                                            (items:{ libroElemento:ILibro, cantidadElemento:number}[])=> items.reduce( (suma,item)=> suma + (item.libroElemento.Precio * item.cantidadElemento) ,0)
                                          )
                                          );
      this.listaProvincias$=restSvc.RecuperarProvincias();
   }

   ShowCompDatosFacturacion(valor:boolean){
    this.showcompdatosfacturacion=valor;
   }

   ModficarItemPedido( item: [ {libroElemento: ILibro, cantidadElemento:number}, string ]){
    
    let _libro:ILibro=item[0].libroElemento;
    let _cantidad: number=item[0].cantidadElemento;

    switch (item[1]) {
      case 'sumar': _cantidad +=1; break;
      case 'restar': _cantidad -=1; break;
      case 'borrar': _cantidad=0;  break;
    }
    this.storageSvc.OperarElementosPedido(_libro,_cantidad, item[1] != 'borrar' ? 'modificar' : 'borrar');
   }

   FinalizarPedido(){
      console.log('finalzando...');

      let _pedidoActual:IPedido={
          idPedido: window.crypto.randomUUID(),
          fechaPedido: new Date(Date.now()),
          estadoPedido: 'pendiente de pago',
          elementosPedido: [] ,
          subTotalPedido: 0,
          gastosEnvio: this.gastosEnvio,
          totalPedido: 0 + this.gastosEnvio,
          datosPago: this.datosPago
        };

        this.listaItems$.pipe(
                                mergeMap(
                                  (items:Array<{libroElemento:ILibro, cantidadElemento:number}>) => {
                                            _pedidoActual.elementosPedido=items;

                                            let _subtotal=items.reduce( (s,i)=>s + (i.libroElemento.Precio * i.cantidadElemento), 0);
                                            _pedidoActual.subTotalPedido=_subtotal;
                                            _pedidoActual.totalPedido=_subtotal + _pedidoActual.gastosEnvio;
                                            
                                            return this.storageSvc.RecuperarDatosCliente() as Observable<ICliente>;
                                          }
                                )
                          ).subscribe(
                            async clientelog => {
                                        console.log('datos a mandar a server...',{ pedido: _pedidoActual, email: clientelog!.cuenta.email});
                                        let _urlObject=await this.restSvc.FinlaizarPedido( _pedidoActual, clientelog!.cuenta.email);
                            }
                          )
        }

}
