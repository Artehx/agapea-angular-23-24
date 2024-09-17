import { Observable } from "rxjs";
import { ICliente } from "./cliente";
import { ILibro } from "./libro";
import { IList } from "./list";

export interface IStorageService {
    //#region ---- metodos SINCRONOS para sevicios localstorageservice,...subjectstorageservice
    AlmacenarDatosCliente(datoscliente:ICliente):void;
    AlmacenarJWT(jwt:string):void;

    RecuperarDatosCliente():Observable<ICliente | null> | ICliente | null; //<---- lo podiamos hacer devolviendo valor de tipo ICliente como en blazor(uso en signals), pero con el observable aprovechamos pipe: async
    RecuperarJWT():Observable<string> | string; //<---- lo podiamos hacer devolviendo valor de tipo String como en blazor(uso en signals), pero con el observable aprovechamos pipe: async
    
    RecuperarClientValue(): ICliente;
    RecuperarClientLists()  : Observable<Array<IList>>;
    RecuperarClienteList(idlist: string) : IList | undefined;

    OperarElementosPedido(libro:ILibro, cantidad:number, operacion:string):void;
    RecuperarElementosPedido():Observable<Array<{libroElemento:ILibro, cantidadElemento:number}>> | Array<{ libroElemento: ILibro; cantidadElemento: number; }>;
    AlmacenarListas(newlists : IList[]) : void;

    //#endregion

    //#region ----metodos ASINCRONOS para servicio indexedDB---

    //#endregion


}