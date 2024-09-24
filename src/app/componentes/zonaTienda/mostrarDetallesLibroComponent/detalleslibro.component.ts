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
import { of, forkJoin, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IComment } from '../../../modelos/comment';
import { signalCommentsService } from '../../../servicios/signalComments.service';
import { ViewChild } from '@angular/core';

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

  public comments = signal<Array<IComment>>([]);

  public comment : IComment = {

    id: window.crypto.randomUUID(),
    comment: '',
    date: new Date(Date.now()),
    emailClient: '',
    state: 'Pendiente',
    isbn13: ''
    
  }

  public list: IList = {
    idList: window.crypto.randomUUID(),
    name: '',
    description: '',
    emailClient: '',
    books: [],
    type: 'Lista pública'
    
};

  constructor(private restSvc:RestnodeService, private activatedRoute:ActivatedRoute,  @Inject(MI_TOKEN_SERVICIOSTORAGE) private storageSvc : IStorageService,
              private toastr: ToastrService, private signalStorage : signalCommentsService){
    this.libro$=this.activatedRoute.paramMap.pipe(concatMap((params:ParamMap)=>{ return this.restSvc.RecuperarUnLibro(params.get('isbn')||'') }) );
 
  }



  ngOnInit(): void {
    
    this.libroSubscription = this.libro$.subscribe({
      next: (libro) => {
        this.libro = libro;
        console.log('El libro es -> ', libro);
        this.comment.isbn13 = this.libro?.ISBN13;

        this.clientLogged! = this.storageSvc.RecuperarClientValue();

        if(this.clientLogged != null){
          
          this.clientLists$ = this.storageSvc.RecuperarClientLists();
          this.list.emailClient = this.clientLogged.cuenta.email;
          this.comment.emailClient = this.clientLogged.cuenta.email;
          this.updateListsWithBook();
    
         
    
        } else {
    
          console.log('El libro (else) ', this.libro?.ISBN13)
          this.getComments(this.libro!.ISBN13);


        }


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

  getComments(isbn13 : string) {

    //console.log('Recupero comentarios del libro ', isbn13);
  
    this.restSvc.getAllComments(isbn13).subscribe( {

      next: (comments: IComment[]) => {
        
          console.log('Comentarios en el front -> ', comments);
          this.signalStorage.SaveComments(comments); 
          
          this.comments.set(comments);
          console.log('La señal -> ', this.comments())

          //Obtener imagenes 
          const profileImageRequests = this.comments().map(comment => 
            this.restSvc.getUserProfileImage(comment.emailClient)
          );

          forkJoin(profileImageRequests).subscribe(profileImages => {
            profileImages.forEach((image, i) => {

                console.log('Imagenes -> ', image);
                this.comments()[i].imagenAvatarBASE64 = image.imagenAvatarBASE64;

                console.log(this.comments()[i].imagenAvatarBASE64)

                console.log('Señal -> ', this.comments());

            });
            this.comments.set(comments);
          })

      }

    })

    



  }

  saveCommentForBack() {
    
    

     console.log('Entra por la puerta grande')
    this.restSvc.saveComment(this.comment).subscribe({
     next: (response : IRestMessage) => {
      console.log(response);
      if(response.codigo === 0){
         
        //Con Subject (RAM)
        //this.storageSvc.AlmacenarListas(response.otrosdatos);
        this.signalStorage.SaveComments(response.otrosdatos);

        //this.clientLists$ = of(response.otrosdatos);

       } else {
      
        //Mostrar mensaje de error 

       }

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
