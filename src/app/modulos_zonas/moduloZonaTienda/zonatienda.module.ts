import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonatiendaRoutingModule } from './zonatienda-routing.module';

// -------------------- componentes de la zona Tienda:
import { MostrarpedidoComponent } from '../../componentes/zonaTienda/pedidoComponent/mostrarpedido.component';
import { MinielementopedidoComponent } from '../../componentes/zonaTienda/miniElementoPedidoComponent/minielementopedido.component';
import { LibrosComponent } from '../../componentes/zonaTienda/librosComponent/libros.component';
import { DetalleslibroComponent } from '../../componentes/zonaTienda/mostrarDetallesLibroComponent/detalleslibro.component';
import { MinilibroComponent } from '../../componentes/zonaTienda/minilibroComponent/minilibro.component';
import { DatosenvioComponent } from '../../componentes/zonaTienda/datosEnvioComponent/datosenvio.component';
import { DatosfacturacionComponent } from '../../componentes/zonaTienda/datosFacturacionComponent/datosfacturacion.component';
import { DatospagoComponent } from '../../componentes/zonaTienda/datosPagoComponent/datospago.component';
import { SharedmoduleModule } from '../SHARED_MODULE/sharedmodule.module';
import { FormsModule } from '@angular/forms';

//-------------------- pipes del modulo de zona Tienda --------------------------------



@NgModule({
  declarations: [
    MinilibroComponent,
    MostrarpedidoComponent,
    MinielementopedidoComponent,
    DatosenvioComponent,
    DatosfacturacionComponent,
    DatospagoComponent,
    LibrosComponent,
    DetalleslibroComponent,
    

  ],
  imports: [
    CommonModule,
    SharedmoduleModule,
    ZonatiendaRoutingModule,
    FormsModule
  ]
})
export class ZonatiendaModule { }
