import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

//------------------------ pipes shared-module para ser usados por modulos de diferentes zonas de la app....
import { RedondeocantidadPipe } from '../../pipes/redondeocantidad.pipe';

//------------------------ compnentes shared-module para ser usados por modulos de diferentes zonas de la app....
import { ModalcrearlistaComponent } from '../..//componentes/zonaCliente/zonaPanelCliente/misListas/modalCrearListaComponent/modalcrearlista.component';

@NgModule({
  declarations: [
    ModalcrearlistaComponent,
    RedondeocantidadPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule //ESTE ERA EL IMPORT QUE FALTABA PARA PODER MAPEAR CON NGMODEL
  ],
   exports:[
    ModalcrearlistaComponent,
    RedondeocantidadPipe,
    ReactiveFormsModule,
    FormsModule
   ]
})
export class SharedmoduleModule { }
