import { Component } from '@angular/core';
import { RestnodeService } from '../../../servicios/restnode.service';
import { Observable } from 'rxjs';
import { ICategoria } from '../../../modelos/categoria';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-tienda',
  templateUrl: './panel-tienda.component.html',
  styleUrl: './panel-tienda.component.css'
})
export class PanelTiendaComponent {
  public listaCategorias$!:Observable<ICategoria[]>;
  
  constructor(private restSvc:RestnodeService, private router:Router){
    this.listaCategorias$=restSvc.RecuperarCategorias('raices');
  }

  public GotoCategoria(ev:Event,cat:ICategoria)
  {
    this.router.navigateByUrl(`/Tienda/Libros/${cat.IdCategoria}`);
  }
}
