import { Component, Inject } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterEvent, UrlSegment } from '@angular/router';
import { Observable, filter, map, tap } from 'rxjs';
import { MI_TOKEN_SERVICIOSTORAGE } from './servicios/injectiontokenstorageservices';
import { IStorageService } from './modelos/interfaceservicios';
import { ICliente } from './modelos/cliente';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  public showPanel:string=''; //<----- 'panelCliente' si en url: /Cliente/Panel/...., 'panelTienda' si en url: /Tienda/..., '' si en url /Cliente/Login o Registro
  public patron:RegExp=new RegExp("(/Cliente/(Login|Registro)|/Tienda/MostrarPedido)","g"); //<--- la opcion "g" o "global" del metodo .match, lo q hace es q si cumple el patron la cadena, no extrae los segmentos del match, solo la cadena entera encontrada
  public datoscliente$:Observable<ICliente | null>;

  constructor(private router:Router,
             @Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService) {
    this.datoscliente$=this.storageSvc.RecuperarDatosCliente() as Observable<ICliente | null>;
    this.router
        .events
        .pipe(
              //tap( ev => console.log(ev) ),
              map( ev => ev as RouterEvent),
              filter( (ev,i)=> ev instanceof NavigationStart)
        )
        .subscribe(
          ev => {
            console.log('testeando url en layout...', ev.url);

            if( /\/Cliente\/Panel\/.*/.test(ev.url)){
                this.showPanel='panelCliente';
            } else if(/\/Tienda\/(?!MostrarPedido)|^\/?$/.test(ev.url)){
               this.showPanel='panelTienda';
            } else {
              this.showPanel='';
            }
            console.log('show panel valoe...', this.showPanel);
          }
        );

   }

}
