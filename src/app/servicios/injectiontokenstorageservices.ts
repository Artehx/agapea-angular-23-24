import { InjectionToken } from "@angular/core";
import { IStorageService } from "../modelos/interfaceservicios";

export const MI_TOKEN_SERVICIOSTORAGE= new InjectionToken<IStorageService>('ClaveStorageServices');
// el string del constructor InjectionToken es la "clave" con la q se van a indentificar en el 
//modulo de DI todos los servicios q implementen la interface IStorageService

//cuando un componente solicite al DI la inyeccion de un servicio q implemente la inteface necesita
//esa constante