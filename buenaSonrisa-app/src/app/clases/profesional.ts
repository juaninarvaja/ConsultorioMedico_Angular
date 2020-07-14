import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { Turno } from './turno';

export class Profesional{
    nombre:string;
    apellido:string;
    dni:number;
    foto:string;
    email:string;
    idAuth:string;
    especialidad:string
    turnos:Array<JSON>;
    constructor(nombre:string,apellido:string,dni:number,foto:string,email:string,idAuth:string,especialidad:string) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.foto = foto;
        this.email = email;
        this.idAuth=idAuth;
        this.especialidad = especialidad;
    }
}