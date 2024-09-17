import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { compareToValidator } from '../../../validators/compareTo';
import { ICliente } from '../../../modelos/cliente';
import { IList } from '../../../modelos/list';
import { IRestMessage } from '../../../modelos/restmessage';
import { RestnodeService } from '../../../servicios/restnode.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  public miform:FormGroup;

  constructor(private router: Router, private restSvc: RestnodeService) {
    this.miform=new FormGroup(
      {
        nombre: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(50) ]  ),
        apellidos: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(200) ]),
        email: new FormControl('', [ Validators.required, Validators.email ] ), //<---- validador asincrono para comprobar q no exista ya el email
        repemail: new FormControl('', [ Validators.required, Validators.email, compareToValidator('email') ]),
        password: new FormControl('',[ Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')] ),
        repassword: new FormControl('',[ Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$'), compareToValidator('password') ]),
        login: new FormControl('',[ Validators.required,Validators.minLength(3),Validators.maxLength(25) ]),
        telefono: new FormControl()
      }
    );
    
  }

  registrarCliente(){
     console.log(this.miform);
     
     let nuevoCliente : ICliente = {
      nombre: this.miform.controls['nombre'].value,
      apellidos: this.miform.controls['apellidos'].value,
      telefono: this.miform.controls['telefono'].value,
      cuenta: {
         email: this.miform.controls['email'].value,
         password: this.miform.controls['password'].value,
         login: this.miform.controls['login'].value,
         cuentaActiva: false,
      },
      descripcion: '',
      genero: '',
      fechaNacimiento: new Date(),
      direcciones: [],
      pedidos: [],
      lists: []   
      
    };

    let listaCli: IList = {
      idList: window.crypto.randomUUID(),
      emailClient: this.miform.controls['email'].value,
      description: 'Esta es la lista predeterminada...',
      name: 'Lista de deseos',
      books: []
    }

    nuevoCliente.lists?.push(listaCli)

    this.restSvc.RegistrarClienteObs(nuevoCliente).subscribe({
      next: (respuesta: IRestMessage) => {
        console.log("Respuesta del server", respuesta);
        if (respuesta.codigo === 0) {
 
          this.router.navigateByUrl('/Cliente/Login');
        } else {
          console.log('Registro fallido');
        }
      },
      error: (error) => {
        console.error("Error en el registro", error);
        
      }
    });



  }

}
