import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RestnodeService } from '../../../../../servicios/restnode.service';
import { IDireccion } from '../../../../../modelos/direccion';
import { IProvincia } from '../../../../../modelos/provincia';
import { IMunicipio } from '../../../../../modelos/municipio';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modaldirecciones',
  templateUrl: './modaldirecciones.component.html',
  styleUrl: './modaldirecciones.component.css'
})
export class ModaldireccionesComponent {
  //#region ---- parametro @Input de toda la vida, con setter par interceptar cambios en vez de metodo componente OnChanges --------
  //
  private _value!:IDireccion;
  @Input() set direccionEd (value:IDireccion){
        console.log('...estamos en el set de parametro input en modaldirecciones....cambiando su valor....');
        if(value!.calle == '' && value!.cp==''){
              this.operacion='crear';
              //reseteo formulario...
              this.formdirecciones.reset();
        } else {
              this.operacion='modicar';
              this.PrecargaDatosFormConDireccionModif();
              //precargamos las cajas del formulario con valores de la direccion pasada como parametro
        }
        this._value=value;
      };
        get direccionEd():IDireccion {
          console.log('...estamos en el get del parametro input en modal direcciones, recuperando su valor... ');
          return this._value;
          
        }
  //#endregion
  
  //---con SIGNAL-INPUT: input() y effect() ----------------
  //public direccionEd=input.required<IDireccion>();

  public formdirecciones: FormGroup;
  public operacion:string='crear';
  public listaprovincias$!:Observable<Array<IProvincia>>;
  public listamunicipios$!:Observable<Array<IMunicipio>>;
  @ViewChild('btonCerrar') btonCerrar!:ElementRef;
  @ViewChild('selectmunis') selectmunis!:ElementRef;
  @Output() modifcrearDirecEvent:EventEmitter<[IDireccion,string]>=new EventEmitter<[IDireccion,string]>();

  constructor(private restSvc:RestnodeService, private renderer2: Renderer2)  {
    this.listaprovincias$=restSvc.RecuperarProvincias();

    this.formdirecciones = new FormGroup(
                                      {
                                        calle:new FormControl('',[Validators.required]),
                                        cp: new FormControl('',[Validators.required, Validators.pattern('^[0-9]{5}$')]),
                                        pais: new FormControl( 'España'),
                                        provincia: new FormControl(),
                                        municipio: new FormControl()
                                      }
      ); //cierre formgroup direcciones

      //-------------efecto sobre signal-input:----------------------------
      // effect(
      //   ()=>{
      //         if(this.direccionEd().calle == '' && this.direccionEd().cp==''){
      //               this.operacion='crear';
      //               //reseteo formulario...
      //               this.formdirecciones.reset();
      //         } else {
      //               this.operacion='modicar';
      //               //precargamos las cajas del formulario con valores de la direccion pasada como parametro
      //               this.PrecargaDatosFormConDireccionModif(); //<--- OJO!!!! tengo q ejecutar la señal para obtener el objeto direccion...
      //         }          
      //         }
      // );
    } 

    // OnChanges(){
    //   //cada vez q cambia valor de parametro @Input, se ejecuta este metodo....
    // }

   public  CargarMunicipios( provSelec:string){ //<--- va: "cpro - nombre provincia"
      //this.selectmunis.nativeElement.innerHTML='';
      this.listamunicipios$=this.restSvc.RecuperarMunicipios(provSelec.split('-')[0]);
      this.renderer2.removeAttribute(this.selectmunis.nativeElement, 'disabled');

    }


    private  PrecargaDatosFormConDireccionModif(){

      this.formdirecciones.controls['calle'].setValue(this.direccionEd!.calle);
      this.formdirecciones.controls['cp'].setValue(this.direccionEd!.cp);
      this.formdirecciones.controls['pais'].setValue(this.direccionEd!.pais);
      this.formdirecciones.controls['provincia'].setValue(this.direccionEd!.provincia.CPRO + '-' + this.direccionEd!.provincia.PRO);
      this.CargarMunicipios(this.direccionEd!.provincia.CPRO);
  
      //dejo un poco de tiempo para q se carguen los municipios...
      setTimeout( 
        ()=> this.formdirecciones.controls['municipio'].setValue(this.direccionEd!.municipio.CMUM + '-' + this.direccionEd!.municipio.DMUN50),
        1000
      );   
    }


    public OperarDireccion(){
      let { provincia, municipio, calle, cp, pais }=this.formdirecciones.value;
      
      let _datosdirec:IDireccion = {
        idDireccion: this.operacion=='crear' ? window.crypto.randomUUID() : this.direccionEd!.idDireccion,
        calle,
        cp,
        pais,
        provincia: { CCOM:'', CPRO: provincia.split('-')[0], PRO:provincia.split('-')[1] },
        municipio: { CPRO: provincia.split('-')[0], CMUM: municipio.split('-')[0], DMUN50:municipio.split('-')[1], CUN:'' },
        esPrincipal:false,
        esFacturacion:false
      }
      if(this.operacion=='modificar') this.operacion='fin-modificacion';
      this.modifcrearDirecEvent.emit( [_datosdirec, this.operacion ]);

      //tras alta o modificacion, ocultamos modal..y reseteamos form
      this.operacion='crear';
      this.formdirecciones.reset();
      this.HideModal();
    }

    public HideModal(){
      this.formdirecciones.reset();
      this.operacion='crear';
      this.btonCerrar.nativeElement.click();
    }
}
