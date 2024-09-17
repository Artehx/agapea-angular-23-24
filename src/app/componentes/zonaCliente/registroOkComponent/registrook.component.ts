import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestnodeService } from '../../../servicios/restnode.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IRestMessage } from '../../../modelos/restmessage';
import { Subscription, concatMap, tap } from 'rxjs';

@Component({
  selector: 'app-registrook',
  templateUrl: './registrook.component.html',
  styleUrl: './registrook.component.css'
})
export class RegistrookComponent implements OnInit,OnDestroy{

  private paramsSuscriptor!:Subscription;

  constructor( private restSvc:RestnodeService, 
               private router:Router,
               private activatedRoute:ActivatedRoute) {
      
  }
  ngOnDestroy(): void {
    this.paramsSuscriptor.unsubscribe();
  }

  ngOnInit(): void {
    /*la url q se manda desde firebase tiene este formato:
    http://localhost:4200/Cliente/RegistroOk ? mode=verifyEmail & 
                                               oobCode=....codigo &
                                               apikey=.....

      ¿¿como extraigo parametros de la url en angular?? hacer un metodo en el servicio de angular RestnodeService
      llamado AcitvarEmail donde le pasamos estos parametros
    */

    //----extrayendo parametros de la instantanea de la ruta q hay en el navegador en el instante de carga del componemte: ----
    /* let _mode: string|null=this.activatedRoute.snapshot.queryParamMap.get('mode');
    // let _oobcode: string|null=this.activatedRoute.snapshot.queryParamMap.get('oobCode');
    // let _apiKey: string|null=this.activatedRoute.snapshot.queryParamMap.get('apiKey');
    
    // let _resp:IRestMessage=this.restSvc.ActivarEmail(_mode,_oobcode,_apiKey);
    */
    
    //----usando parametros obtenidos del objservable q nos da el servicio ActivatedRoute (detectas cambios constantes en la url):
    /*
      formato oberserver, objeto q recibe el metodo subscribe de un observable:
            {
            next:(dato)=>{}, <------ generalmente, solo se pone esta en la subscripcion...
            error:(err)=>{},
            complete:()=>{}
          }

    */

    //para manejar observables anidados(nested-observables, manejar operadores: concatMap, mergeMap, switchMap, exahustMap)
    /*
    this.paramsSuscriptor=this.activatedRoute.queryParamMap.subscribe(
      (parametros:ParamMap)=>{
          let _mode: string|null=parametros.get('mode');
          let _oobcode: string|null=parametros.get('oobCode');
          let _apiKey: string|null=parametros.get('apiKey')
          
          this.restSvc.ActivarCuenta(_mode,_oobcode,_apiKey).subscribe(
            (resp:IRestMessage)=>{
                  if(resp.codigo==0){
                      //al login...
                      this.router.navigateByUrl('/Cliente/Login');
                  } else {
                    //mostrar mensajes de error en vista (fallo activacion)
                  }
            }
          )
      }
    )
    */
    this.paramsSuscriptor=this.activatedRoute
                              .queryParamMap
                              .pipe(
                                    tap( (parametros:ParamMap)=>console.log('parametros en url....', parametros.keys)   ),
                                    concatMap( (parametros:ParamMap)=>{
                                                              let _mode: string|null=parametros.get('mode');
                                                              let _oobcode: string|null=parametros.get('oobCode');
                                                              let _apiKey: string|null=parametros.get('apiKey');
                                                              return this.restSvc.ActivarCuenta(_mode,_oobcode,_apiKey);
                                      
                                    } )
                              ).subscribe( (resp:IRestMessage)=>{
                                              if(resp.codigo==0){
                                                //al login...
                                                this.router.navigateByUrl('/Cliente/Login');
                                            } else {
                                              //mostrar mensajes de error en vista (fallo activacion)
                                            } 
                              });
      
  }

}
