import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, last, map, of } from 'rxjs';
import { MI_TOKEN_SERVICIOSTORAGE } from '../servicios/injectiontokenstorageservices';
import { IStorageService } from '../modelos/interfaceservicios';

@Injectable({
  providedIn: 'root'
})
export class AccesoPedidoGuard implements CanActivateChild {
 
   constructor( @Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService,
                private router:Router){}

  //el guard funcional seria este metodo:
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
      return this.storageSvc
                  .RecuperarDatosCliente()
                  .pipe(
                         map( datos => datos != null ? true : this.router.createUrlTree(['/Cliente/Login']) ),
                         last(),
                          );
      // .subscribe(
      //   datos => {
      //     console.log('ACTUANDO EL GUARD...');
      //     return datos != null ? true : this.router.navigateByUrl('/Cliente/Login'); 
      //   }
      // ) <-------- esto no lo puedo hacer, pq subscribe no recibe los datos de forma sincrona, sino ASINCRONA, no te va a devolver un
      //            valor boolean o urltree inmediato, sino q puede tardar....tengo q devolver un Observable o una promesa; transformo
      //            observable del servicio .RecuperarDatosCliente(): Observable<ICliente | null> <===> Observable<booelan |UrlTree>
      //                                                                                           map()
      
  }
  
}
