import { Component, Inject, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { Observable, Subscription, concat, concatMap } from 'rxjs';
import { ILibro } from '../../../modelos/libro';
import { RestnodeService } from '../../../servicios/restnode.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IList } from '../../../modelos/list';
import { MI_TOKEN_SERVICIOSTORAGE } from '../../../servicios/injectiontokenstorageservices';
import { IStorageService } from '../../../modelos/interfaceservicios';
import { ICliente } from '../../../modelos/cliente';
import { IRestMessage } from '../../../modelos/restmessage';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalleslibro',
  templateUrl: './detalleslibro.component.html',
  styleUrl: './detalleslibro.component.css'
})
export class DetalleslibroComponent implements OnInit, OnDestroy {

  public libro$!:Observable<ILibro>;

  private libroSubscription?: Subscription;
  public libro?: ILibro;
  
  public clientLogged: ICliente | null = null;
  public clientLists$!: Observable<Array<IList>>;

  public listsWithBook = signal<Map<string, boolean>>(new Map());

  public list: IList = {
    idList: window.crypto.randomUUID(),
    name: '',
    description: '',
    emailClient: '',
    books: [],
    type: 'Lista pública'
    
};

  constructor(private restSvc:RestnodeService, private activatedRoute:ActivatedRoute,  @Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc : IStorageService,
              private toastr: ToastrService){
    this.libro$=this.activatedRoute.paramMap.pipe(concatMap((params:ParamMap)=>{ return this.restSvc.RecuperarUnLibro(params.get('isbn')||'') }) );
  }
  ngOnInit(): void {
    
    this.clientLogged! = this.storageSvc.RecuperarClientValue();
    this.clientLists$ = this.storageSvc.RecuperarClientLists();
    this.list.emailClient = this.clientLogged.cuenta.email;


    this.libroSubscription = this.libro$.subscribe({
      next: (libro) => {
        this.libro = libro;
        this.updateListsWithBook();
      },

      error: (err) => {
        console.log('Error al obtener el libro: ', err)
      }
    })
     


  }

  ngOnDestroy(): void {
      if(this.libroSubscription){
        this.libroSubscription.unsubscribe();
      }
  }

  showBookSaved() {
    this.toastr.success('¡Libro guardado en la lista!');
  }

  showBookRemoved() {
    this.toastr.warning('Libro eliminado de la lista')
  }

  private updateListsWithBook() : void {

    if(this.libro && this.clientLogged){

      const updatedLists = new Map<string, boolean>();

      this.clientLists$.subscribe(lists => {
        lists.forEach((list: IList) => {  
          const isBookInList = list.books.some((book: ILibro) => book.ISBN13 === this.libro?.ISBN13); 
          updatedLists.set(list.idList!, isBookInList);  
        });
      });

      this.listsWithBook.set(updatedLists);
    }

  }

  addOrRemoveBook(idList : string) {

    console.log('Entra en AddOrRemoveBook... ')
    this.restSvc.toggleBookInList(idList, this.libro?.ISBN13!, this.clientLogged?.cuenta.email!).subscribe({
       next: (response: IRestMessage) => {
        if(response.codigo === 0){

          //Actualizamos las listas almacenadas
          this.storageSvc.AlmacenarListas(response.otrosdatos);
          this.clientLists$ = of(response.otrosdatos);

          this.updateListsWithBook();
          console.log('Mensaje -> ', response.mensaje);
          response.mensaje === 'agregar' ? this.showBookSaved() : this.showBookRemoved();
        }

       },
       
       error: (error: any) => {
        console.log('Error al modificar el libro de la lista: ', error)
       }

    })



  }

  sendListForBack(){ 
  

    this.restSvc.createListWithBook(this.list, this.libro?.ISBN13!).subscribe({
      next: (response: IRestMessage) => {
       
       if(response.codigo === 0){
      
        this.storageSvc.AlmacenarListas(response.otrosdatos);

        this.clientLists$ = of(response.otrosdatos);

       } else {
      
        //Mostrar mensaje de error 

       }


      }, 
      error:(error: any) => {

        console.log('Algo salio mal -> ', error)

      }
    })
    
  }

}
