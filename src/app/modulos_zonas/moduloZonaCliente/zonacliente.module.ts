import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonaclienteRoutingModule } from './zonacliente-routing.module'
import { DragDropModule } from '@angular/cdk/drag-drop';
//-------------- componentes a importar por este modulo de zona Cliente -------------
import { LoginComponent} from '../../componentes/zonaCliente/loginComponent/login.component' 
import { RegistroComponent } from '../../componentes/zonaCliente/registroComponent/registro.component' 
import { RegistrookComponent } from '../../componentes/zonaCliente/registroOkComponent/registrook.component' 
import { InicioPanelComponent } from '../../componentes/zonaCliente/zonaPanelCliente/iicioPanel/inicioPanelComponent/inicio-panel.component';
import { ModaldireccionesComponent } from '../../componentes/zonaCliente/zonaPanelCliente/iicioPanel/modalDireccionesComponent/modaldirecciones.component';
import { MinidireccionComponent } from '../../componentes/zonaCliente/zonaPanelCliente/iicioPanel/miniDireccionComponent/minidireccion.component';
import { MislistasComponent } from '../../componentes/zonaCliente/zonaPanelCliente/misListas/mislistasComponent/mislistas.component';
import { MinilistaComponent } from '../../componentes/zonaCliente/zonaPanelCliente/misListas/minilistaComponent/minilista.component';
import { DetalleslistaComponent } from '../../componentes/zonaCliente/zonaPanelCliente/misListas/detalleslistaComponent/detalleslista.component';
import { MinilibrolistaComponent } from '../../componentes/zonaCliente/zonaPanelCliente/misListas/minilibrolistaComponent/minilibrolista.component';


//-------------------- directivas del modulo princiapal de la aplicacion ---------------------------
import { EmailfilterdomainDirective } from '../../directivas/emailfilterdomain.directive'
import { ComprobacionexisteemailDirective } from '../../directivas/comprobacionexisteemail.directive';
import { SharedmoduleModule } from '../SHARED_MODULE/sharedmodule.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EmailfilterdomainDirective,
    ComprobacionexisteemailDirective,
    LoginComponent,
    RegistroComponent,
    RegistrookComponent,
    InicioPanelComponent,
    ModaldireccionesComponent,
    MinidireccionComponent,
    MislistasComponent,
    MinilistaComponent,
    DetalleslistaComponent,
    MinilibrolistaComponent
  ],
  imports: [
    CommonModule,
    SharedmoduleModule,
    ZonaclienteRoutingModule,
    FormsModule,
    DragDropModule
  ]
})
export class ZonaclienteModule { }