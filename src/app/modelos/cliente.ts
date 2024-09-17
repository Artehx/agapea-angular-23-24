import { IDireccion } from "./direccion";
import { IPedido } from "./pedido";
import { IList } from "./list";

export interface ICliente {
    nombre:      string;
    apellidos:   string;
    cuenta:      {  email: string, login?:string, password: string, cuentaActiva?:boolean, imagenAvatarBASE64?:string };
    telefono:    string;
    direcciones?: IDireccion[];
    pedidos?:     IPedido[];
    lists?:      IList[];
    genero?:     string;
    fechaNacimiento?:    Date;
    descripcion?:   string;
}


