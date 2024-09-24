

export interface IComment {

    id: string;
    comment: string;
    state: string;
    emailClient: string;
    date: Date;
    imagenAvatarBASE64?: String;
    login?:string;
    isbn13?: string;


}