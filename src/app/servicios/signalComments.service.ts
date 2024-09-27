import { Injectable, signal } from "@angular/core";
import { IComment } from "../modelos/comment";

@Injectable({
    providedIn: 'root'
  })
export class signalCommentsService {

    private bookComments = signal<Array<IComment>>([]);
    

    constructor() {}

    SaveComments(comments : IComment[]) {

    
        this.bookComments.set(comments);
    }

    GetComments() : Array<IComment> {

        
        return this.bookComments();
    }

    SearchComment(idComment : string) {
        
        return this.bookComments().find((e : IComment) => e.id == idComment);

    }

}