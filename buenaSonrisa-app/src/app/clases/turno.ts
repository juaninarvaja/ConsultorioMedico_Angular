import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';

export class Turno{
    fecha:string;
    idCliente:string;
    info:string;
    estado:string;
    resenia:string;
    encuesta:string;

    constructor(fecha:string,idCliente:string) {
        this.fecha= fecha;
        this.idCliente=idCliente;
    }
}
