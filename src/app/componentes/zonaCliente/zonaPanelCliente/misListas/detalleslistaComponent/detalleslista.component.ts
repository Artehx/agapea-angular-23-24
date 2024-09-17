import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { concat, concatMap, Observable } from 'rxjs';
import { IList } from '../../../../../modelos/list';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../../../servicios/injectiontokenstorageservices';
import { IStorageService } from '../../../../../modelos/interfaceservicios';
import { RestnodeService } from '../../../../../servicios/restnode.service';
import { ICliente } from '../../../../../modelos/cliente';
import { IRestMessage } from '../../../../../modelos/restmessage';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalleslista',
  templateUrl: './detalleslista.component.html',
  styleUrl: './detalleslista.component.css'
})
export class DetalleslistaComponent implements OnInit {
  public editarLista:boolean=false;
  public list! : IList | undefined;

  public clienteLogged: ICliente | null = null;

  public idList? : string | null;

  constructor(private activatedRoute: ActivatedRoute,
              @Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc : IStorageService,
              private restService: RestnodeService,
              private router: Router, private toastr: ToastrService)
  {
    this.idList = this.activatedRoute.snapshot.queryParamMap.get('idlista');
    //Utilizar QueryParamMap cuando en la ruta la id a sacar sea ?? (Query)
    //Utilizar ParamMap cuando el parametro de la ruta venga definido :
    console.log(`La id de la lista es ${this.idList}`);
    if(this.idList != null || '') {

      this.list = this.storageSvc.RecuperarClienteList(this.idList!);
      console.log(`Datos de la lista -> ${this.list}`)
    }

  }
  ngOnInit(): void {
    this.clienteLogged! = this.storageSvc.RecuperarClientValue();
    

  }

  showListRemoved() {
    this.toastr.warning('Lista eliminada con exito');
  }

  removeList(){

   console.log(`Eliminando la lista: ${this.idList}`)
   this.restService.removeList(this.idList!, this.clienteLogged!.cuenta.email).subscribe({
    next:(response: IRestMessage) => {

      if(response.codigo === 0){

        this.storageSvc.AlmacenarListas(response.otrosdatos);
        this.showListRemoved();
        this.router.navigateByUrl('/Cliente/Panel/MisListas');

      } else {

        //Mostrar mensaje de error
      }

    },

    error: (error: any) => {
      
      console.log('Algo salio mal -> ', error)

    }
   })

  }
}
