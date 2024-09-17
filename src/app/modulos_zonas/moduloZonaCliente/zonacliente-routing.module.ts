import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent} from '../../componentes/zonaCliente/loginComponent/login.component' 
import { RegistroComponent } from '../../componentes/zonaCliente/registroComponent/registro.component' 
import { RegistrookComponent } from '../../componentes/zonaCliente/registroOkComponent/registrook.component' 
import { InicioPanelComponent } from '../../componentes/zonaCliente/zonaPanelCliente/iicioPanel/inicioPanelComponent/inicio-panel.component';
import { MislistasComponent } from '../../componentes/zonaCliente/zonaPanelCliente/misListas/mislistasComponent/mislistas.component';
import { DetalleslistaComponent } from '../../componentes/zonaCliente/zonaPanelCliente/misListas/detalleslistaComponent/detalleslista.component';


const routes: Routes = [
                        { 
                            path: 'Cliente',
                            children:[
                                      { path: 'Registro', component: RegistroComponent },
                                      { path: 'Login', component: LoginComponent },
                                      { path: 'RegistroOk', component: RegistrookComponent },
                                      { path: 'Panel', children:[
                                                { path: 'InicioPanel', component: InicioPanelComponent },
                                                { path: 'MisListas', component: MislistasComponent },
                                                { path: 'DetallesLista', component: DetalleslistaComponent }
                                      ]}
                            ]  
                        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonaclienteRoutingModule { }
