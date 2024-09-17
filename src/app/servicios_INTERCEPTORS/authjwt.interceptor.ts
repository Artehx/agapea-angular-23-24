import { Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable, concatMap, first, take, tap } from 'rxjs';
import { MI_TOKEN_SERVICIOSTORAGE } from '../servicios/injectiontokenstorageservices';
import { IStorageService } from '../modelos/interfaceservicios';

@Injectable()
export class AuthjwtInterceptor implements HttpInterceptor {

  //interceptor para añadir en todas las pet. ajax HTTP-REQUEST a servicios de nodejs la cabecera
  // Authentication: Bearer .....
  //si no hay jwt almacenado por el servicio IStorageService, no cambio pet.original
  
  constructor(@Inject(MI_TOKEN_SERVICIOSTORAGE)private storageSvc:IStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return (this.storageSvc
        .RecuperarJWT() as Observable<string>)
        .pipe(
          take(1),
          tap( (jwt:string)=> console.log( 'estamos en INTERCEPTOR para intentar añadir JWT en cabecera....', jwt)),
          concatMap(
                    (jwt:string)=>{
                        if(jwt != null || jwt != '') {
                          let _reqclonada=request.clone( { setHeaders: { Authorization: `Bearer ${jwt}`} })
                          return next.handle(_reqclonada);
                        } else {
                          return next.handle(request);
                        }
                     }
                    )
        );
    //     .subscribe(
    //             jwt => {
    //                     //como voy a modificar pet.original, la clono!!!!
    //                     if(jwt != null || jwt != '') {
    //                       let _reqclonada=request.clone( { setHeaders: { Authorization: `Bearer ${jwt}`} })
    //                       return next.handle(_reqclonada);
    //                     } else {
    //                       return next.handle(request);
    //                     }
    //               }
    // );
    
  }
}
