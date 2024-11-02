export interface User {
    id : number;
    email : string;
    status : string;
    name : string;
    dniu : string;
    password ? : string;
    roles ? : Rol[] ;
}

export interface Rol {
    id: number,
    name? : string,
    status? : string
}

export interface UserList {
    totalitems : number;
    items: [User] | [];
    offset: number;
    limit: number;
}