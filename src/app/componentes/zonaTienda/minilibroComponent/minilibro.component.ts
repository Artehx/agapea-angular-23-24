import { Component, Inject, Input, inject } from '@angular/core';
import { ILibro } from '../../../modelos/libro';
import { IStorageService } from '../../../modelos/interfaceservicios';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservices';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minilibro',
  templateUrl: './minilibro.component.html',
  styleUrl: './minilibro.component.css'
})
export class MinilibroComponent {
  @Input() libroAPintar!:ILibro;

   constructor(@Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc:IStorageService, private router:Router) { }
  
   AddLibroPedido(){
      this.storageSvc.OperarElementosPedido(this.libroAPintar,1,'añadir');
      this.router.navigateByUrl('/Tienda/MostrarPedido');
  }
}
