import { ICliente } from "./cliente";

export interface IRestMessage{
    codigo: number;
    mensaje:string;
    error?:string;
    token?:string;
    datoscliente?:ICliente;
    otrosdatos?:any;
}