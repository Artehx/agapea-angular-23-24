import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { IRestMessage } from '../modelos/restmessage';
import { ILibro } from '../modelos/libro';
import { ICategoria } from '../modelos/categoria';
import { IProvincia } from '../modelos/provincia';
import { IMunicipio } from '../modelos/municipio';
import { IDatosPago } from '../modelos/datospago';
import { IPedido } from '../modelos/pedido';
import { ICliente } from '../modelos/cliente';
import { IDireccion } from '../modelos/direccion';
import { IList } from '../modelos/list';
import { IComment } from '../modelos/comment';

@Injectable({
  providedIn: 'root'
})
export class RestnodeService {
  //servicio para poder hacer pet.rest a serv.RESFTULL de nodejs....
  constructor(private _httpclient:HttpClient) { }


  //#region ------ metodos para zona Cliente ----------
  public LoginCliente(credenciales:{email:string, password:string}):Promise<IRestMessage>{
    //¿¿como cojones hago para mandar objeto "credenciales" q me pasa el componente login.component.ts
    //a nodejs usando el servicio HttpClient de angular??
        return lastValueFrom(
                    this._httpclient.post<IRestMessage>(
                              'http://localhost:3000/api/Cliente/Login',
                              credenciales,
                              { 
                                headers: new HttpHeaders({'Content-Type': 'application/json'})
                              }
                              )
        );

  }

  RegistrarClienteObs(nuevoCliente: ICliente): Observable<IRestMessage> {
    // Simplemente devuelve el Observable del método post
    return this._httpclient.post<IRestMessage>(
      'http://localhost:3000/api/Cliente/Registro',
      nuevoCliente,
      { headers: new HttpHeaders({'Content-Type':'application/json'}) }
    );
  }

  public ComprobarEmail(email:string):Observable<IRestMessage>{
    return this._httpclient.get(`http://localhost:3000/api/Cliente/ComprobarEmail?email=${email}`) as Observable<IRestMessage>;
  }

  public ActivarCuenta(mode:string|null, oobCode:string|null, apiKey:string|null):Observable<IRestMessage>{
      return this._httpclient.get(`http://localhost:3000/api/Cliente/ActivarCuenta?mod=${mode}&cod=${oobCode}&key=${apiKey}`) as Observable<IRestMessage>;
  }


  public async UploadImagen(imagenBASE64:string, email: string): Promise<IRestMessage>  {
    return await lastValueFrom(
              this._httpclient.post<IRestMessage>(
                                                 'http://localhost:3000/api/Cliente/UploadImagen',
                                                 {imagen: imagenBASE64, emailcliente: email },
                                                 { headers: new HttpHeaders( {'Content-Type':'application/json'}) }
                                                 )
                              );
  }
  public async OperarDireccion(direccion:IDireccion, operacion:string, email:string ):  Promise<IRestMessage> {
    console.log('en servicio, metodo operardireccion, mandando...',{ direccion,operacion,email});

    return await lastValueFrom(
              this._httpclient.post<IRestMessage>(
                                                  'http://localhost:3000/api/Cliente/OperarDireccion',
                                                  { direccion, operacion, email },
                                                  { headers: new HttpHeaders( {'content-Type':'application/json'} ) }
                                                )
    );
  }
  //#endregion

  //#region ------ metodos para zona Tienda -----------
    public RecuperarCategorias(idcat:string): Observable<ICategoria[]>{
      if(!! idcat ) idcat='raices';
      return this._httpclient.get<ICategoria[]>(`http://localhost:3000/api/Tienda/RecuperarCategorias?idcat=${idcat}`);

    }

    public  RecuperarLibros(idcat:string): Observable<ILibro[]>{
        if(idcat==null || idcat==undefined || idcat=='' ) idcat='2-10';
        return this._httpclient.get<ILibro[]>(`http://localhost:3000/api/Tienda/RecuperarLibros?idcat=${idcat}`);
    }


    public RecuperarUnLibro(isbn:string):Observable<ILibro> {
        return this._httpclient.get<ILibro>(`http://localhost:3000/api/Tienda/RecuperarUnLibro?isbn=${isbn}`);
    }

    public RecuperarProvincias():Observable<IProvincia[]>{
        return this._httpclient.get<IProvincia[]>('http://localhost:3000/api/Tienda/RecuperarProvincias');
    }

    public RecuperarMunicipios(codpro:string):Observable<IMunicipio[]>{
      return this._httpclient.get<IMunicipio[]>(`http://localhost:3000/api/Tienda/RecuperarMunicipios?codpro=${codpro}`);
  }

  public FinlaizarPedido( pedido:IPedido, email:string):Promise<{url:string}>{
    return lastValueFrom(
                      this._httpclient
                          .post<{url:string}>(
                            "http://localhost:3000/api/Tienda/FinalizarPedido",
                            { pedido, email},
                            { headers: new HttpHeaders({'Content-Type':'application/json'}) }
                          )
                    );
  }

  public createList(list: IList): Observable<IRestMessage >{
    return  this._httpclient.post<IRestMessage>(
                            "http://localhost:3000/api/Cliente/SaveList",
                            { list },
                            { headers: new HttpHeaders({'Content-Type':'application/json'}) }
                          )
                  
  }

  public createListWithBook(list: IList, bookId: String): Observable<IRestMessage> {

      return this._httpclient.post<IRestMessage>(
             "http://localhost:3000/api/Cliente/SaveList",
              {list, bookId},
              {headers: new HttpHeaders({'Content-Type':'application/json'})}
      
      )
  }

public toggleBookInList(idList: string, isbn13: string, email: string): Observable<IRestMessage> {
       
       return this._httpclient.post<IRestMessage>(
        "http://localhost:3000/api/Cliente/OperateBook",
        {idList, isbn13, email},
        {headers: new HttpHeaders({'Content-Type':'application/json'})}

       )
}

  public removeList(idList: string, email: string) : Observable<IRestMessage>{
    return this._httpclient.post<IRestMessage>(
      "http://localhost:3000/api/Cliente/RemoveList",
      {idList, email},
      {headers: new HttpHeaders({'Content-Type':'application/json'})}

    )

  }

  public saveComment(comment : IComment ) : Observable<IRestMessage> {
    console.log('Enviando...')
    return this._httpclient.post<IRestMessage>(
      "http://localhost:3000/api/Cliente/SaveComment",
      {comment: comment},
      {headers: new HttpHeaders({'Content-Type':'application/json'})}
    )

  }
  public getAllComments(isbn : string) : Observable<IComment[]> {
   
    return this._httpclient.get<IComment[]>(
           `http://localhost:3000/api/Cliente/GetAllComments?isbn=${isbn}`,
           
    )

  }
  public getAllCommentsUser(isbn: string, email: string) : Observable<{ userComment: IComment | null; reviewdComments: IComment[] }> {

    return this._httpclient.get<{userComment: IComment | null; reviewdComments : IComment []}>(`http://localhost:3000/api/Cliente/GetAllCommentsUser?isbn=${isbn}&email=${email}`)

  }

  getUserProfileImage(userEmail: string): Observable<{ imagenAvatarBASE64: string, usuario : string }> {
    return this._httpclient.get<{ imagenAvatarBASE64: string, usuario : string }>(`http://localhost:3000/api/Cliente/GetProfileImage?userEmail=${userEmail}`);
  }

  public changeOrderList(list : IList, email : string)  : Observable<IRestMessage> {

     return this._httpclient.post<IRestMessage>(
      "http://localhost:3000/api/Cliente/ChangeOrderList",
      {list : list, email: email},
      {headers: new HttpHeaders({'Content-Type':'application/json'})}

     )
  }



  

  //#endregion

}
