import { Component, Inject, OnInit } from '@angular/core';
import { IList } from '../../../../../modelos/list';
import { IRestMessage } from '../../../../../modelos/restmessage';
import { Router } from '@angular/router';
import { RestnodeService } from '../../../../../servicios/restnode.service';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../../../servicios/injectiontokenstorageservices';
import { IStorageService } from '../../../../../modelos/interfaceservicios';
import { ICliente } from '../../../../../modelos/cliente';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-mislistas',
  templateUrl: './mislistas.component.html',
  styleUrl: './mislistas.component.css'
})
export class MislistasComponent implements OnInit{

  public clientLogged: ICliente | null = null;
  public clientLists$! : Observable<Array<IList>>;

  public list: IList = {
      idList: window.crypto.randomUUID(),
      name: '',
      description: '',
      emailClient: '',
      books: [],
      type: 'Lista pública'
      
  };

  constructor(private restService: RestnodeService,
              @Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc : IStorageService){
   

  }
  ngOnInit(): void {
    
  this.clientLogged! = this.storageSvc.RecuperarClientValue();
  this.list.emailClient = this.clientLogged.cuenta.email;

  this.clientLists$ = this.storageSvc.RecuperarClientLists();

  //console.log("Datos del cliente -> ", this.clientLogged)

  }

  sendListForBack(){

    console.log("Lista en el padre..Enviando al back..")


    this.restService.createList(this.list).subscribe({
      next:(response: IRestMessage) => {
      
        if(response.codigo === 0){
           //Añado las listas a la sesion
          console.log('Entra aqui...')
         
          console.log('Respuesta -> ', response);
          console.log('Las listas que vienen del back -> ', response.otrosdatos)
          
          //Almaceno las listas en el servicio de almacenamiento
          this.storageSvc.AlmacenarListas(response.otrosdatos);

          //Actualizo las listas localmente en el componente
          // No hecho en el examen del segundo trimestre...
          this.clientLists$ = of(response.otrosdatos);
  
        } else {

          //Mostrar mensaje de error
        }


      },
      error:(error: any) => {

        console.log('Algo salio mal -> ', error)
      },
      complete() {
        console.log("Envío de lista completado");
      },
    })


  }
}
