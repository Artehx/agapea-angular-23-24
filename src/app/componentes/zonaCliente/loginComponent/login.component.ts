import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RestnodeService } from '../../../servicios/restnode.service';
import { IRestMessage } from '../../../modelos/restmessage';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservices';
import { IStorageService } from '../../../modelos/interfaceservicios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public credenciales:{ email:string, password:string}={ email:'', password:''};
  public erroresLoginServer:string="";
  //email: o1ax55709y@bloheyz.com
  //passowrd: Hola1234!

  constructor( private router:Router,
               private restService: RestnodeService,
               @Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService ) {   }

  irARegistro(){
    this.router.navigateByUrl('/Cliente/Registro');
  }

 async LoginCliente(loginform:NgForm){
    console.log('el ngForm vale...', loginform.form);

    const _respuesta:IRestMessage=await this.restService.LoginCliente(loginform.form.value);
    if(_respuesta.codigo===0){
        this.storageSvc.AlmacenarDatosCliente(_respuesta.datoscliente!)
        this.router.navigateByUrl('/Tienda/Libros/2');
    } else {
      //mostrar mensajes de error en vista del componente...
      this.erroresLoginServer=_respuesta.error!;
    }

  }
}
