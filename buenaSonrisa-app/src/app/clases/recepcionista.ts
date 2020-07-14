import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';

export class Recepcionista{
    nombre:string;
    apellido:string;
    dni:number;
    foto:string;
    email:string;
    idAuth:string;
    constructor(nombre:string,apellido:string,dni:number,foto:string,email:string,idAuth:string) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.foto = foto;
        this.email = email;
        this.idAuth=idAuth;
    }
}
