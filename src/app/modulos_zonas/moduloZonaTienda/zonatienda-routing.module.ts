import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MostrarpedidoComponent } from '../../componentes/zonaTienda/pedidoComponent/mostrarpedido.component';
import { LibrosComponent } from '../../componentes/zonaTienda/librosComponent/libros.component';
import { DetalleslibroComponent } from '../../componentes/zonaTienda/mostrarDetallesLibroComponent/detalleslibro.component';

const routes: Routes = [
  {
    path: 'Tienda',
    children:[
      { path: 'Libros/:idcat', component: LibrosComponent },
      { path: 'MostrarLibro/:isbn', component: DetalleslibroComponent },
      { path: 'MostrarPedido', component: MostrarpedidoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonatiendaRoutingModule { }
