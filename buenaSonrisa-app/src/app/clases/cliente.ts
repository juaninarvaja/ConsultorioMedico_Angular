import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';

export class Cliente{
    nombre:string;
    apellido:string;
    dni:number;
    foto:string;
    email:string;
    idauth:string;
    turnos:Array<JSON>;
    constructor(nombre:string,apellido:string,dni:number,foto:string,email:string,idAuth:string) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.foto = foto;
        this.email = email;
        this.idauth=idAuth;
    }
}
