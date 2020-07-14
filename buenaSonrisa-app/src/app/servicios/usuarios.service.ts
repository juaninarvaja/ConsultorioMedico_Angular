import { Injectable } from '@angular/core';
import { Cliente } from '../clases/cliente';
import { AngularFirestore } from '@angular/fire/firestore';
import { Profesional } from '../clases/profesional';
import { Recepcionista } from '../clases/recepcionista';
import { map } from 'rxjs/internal/operators/map';
import { Turno } from '../clases/turno';
import { MAT_ICON_LOCATION } from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  flag:boolean = undefined;
  constructor(private firestore: AngularFirestore) { }


  addCliente(auxCli:Cliente) {
    console.log("entro al servicio y funcion addCliente");
    this.firestore.collection('Clientes').add({
      nombre: auxCli.nombre,
      apellido: auxCli.apellido,
      dni: auxCli.dni,
      email: auxCli.email,
      foto: auxCli.foto.toString(),
      idauth:auxCli.idauth,
      turnos:''

      // image: actorType.image,
      // type: actorType.type
    });
  }
  //agrego recepcionista
  addPro(auxPro:Profesional) {
    this.firestore.collection('Profesionales').add({
      nombre: auxPro.nombre,
      apellido: auxPro.apellido,
      dni: auxPro.dni,
      email: auxPro.email,
      foto: auxPro.foto.toString(),
      idauth:auxPro.idAuth,
      especialidad:auxPro.especialidad,
      turnos:''

      // image: actorType.image,
      // type: actorType.type
    });
  }
  addRec(auxCli:Recepcionista) {
    console.log("entro al servicio y funcion addRec");
    this.firestore.collection('Recepcionistas').add({
      nombre: auxCli.nombre,
      apellido: auxCli.apellido,
      dni: auxCli.dni,
      email: auxCli.email,
      foto: auxCli.foto.toString(),
      idauth:auxCli.idAuth

      // image: actorType.image,
      // type: actorType.type
    });
  }
  saveRolId(rol:string,idAuth:string) {
    console.log("entro al servicio ROlId");
    this.firestore.collection('Rol_IdAuth').add({
      idAuth:idAuth,
      rol:rol

      // image: actorType.image,
      // type: actorType.type
    });
  }

  getClientes() {
    return this.firestore.collection('Clientes').snapshotChanges().pipe(map((clientes) => {
      return clientes.map((a) => {
        const data = a.payload.doc.data() as Cliente;
        // data.id = a.payload.doc.id;
        return data;
      });
    }));
  }
  getProfesionales() {
    return this.firestore.collection('Profesionales').snapshotChanges().pipe(map((clientes) => {
      return clientes.map((a) => {
        const data = a.payload.doc.data() as Profesional;
        // data.id = a.payload.doc.id;
        return data;
      });
    }));
  }
  getNombreClientebyidAuth(idAuth)
  {

  }
  async setTurno(fechaSelect:string,idAuthProf:string,idClienteActivo:string){
     let auxTurno:Turno = new Turno(fechaSelect,idClienteActivo);
     auxTurno.estado = "CONFIRMADO";
     auxTurno.resenia = "";
     var auxTurnostring = JSON.stringify(auxTurno);
     var auxTurnoJSon = JSON.parse(auxTurnostring);
    // console.log(auxTurno);
    // console.log(JSON.stringify(auxTurno));
    
    //setear en el cleinte y en el profesional
    //despues de que cargue el primeroagregar si el profesional no esta ocupado ese dia
    await this.firestore.collection('Profesionales').ref.where('idauth', '==', idAuthProf).get().then(async (documento) => {
   
      let auxPro = new Profesional(documento.docs[0].data().nombre,documento.docs[0].data().apellido,documento.docs[0].data().dni,documento.docs[0].data().foto,
      documento.docs[0].data().email,documento.docs[0].data().idauth,documento.docs[0].data().especialidad);
      auxPro.turnos = [];
      if(documento.docs[0].data().turnos != "")
      {
        console.log("esta seteando en el prfoesional");
         auxPro.turnos = JSON.parse(documento.docs[0].data().turnos);
          let fechaValida:boolean = true;
          console.log(auxPro.turnos);
         auxPro.turnos.forEach(element=> {
           
           let strElement = JSON.stringify(element);
           let cadenaFecha = strElement.substring(10,26);
            // console.log(cadenaFecha.substring(1));
            // console.log(fechaSelect);
          if(cadenaFecha == fechaSelect)
          {
            // return "ya existe alguien en esa fecha";
            fechaValida = false;
            this.flag = false;
          }
          
         });
         if(fechaValida)
         {
           auxPro.turnos.push(auxTurnoJSon); 
           this.flag = true;
          //  return "turno cargado con exito";
         }
         
          //este agrega hay q descomentar
          
      }
      else {
        auxPro.turnos.push(auxTurnoJSon);
        this.flag = true;
        // return "turno cargado con exito";
      }  
      this.firestore.collection('Profesionales').doc(documento.docs[0].id).set({
        apellido:documento.docs[0].data().apellido,
        nombre: documento.docs[0].data().nombre,
        dni: documento.docs[0].data().dni,
        email: documento.docs[0].data().email,
        especialidad: documento.docs[0].data().especialidad,
        foto: documento.docs[0].data().foto,
        idauth: documento.docs[0].data().idauth,
        turnos: JSON.stringify(auxPro.turnos),
      })
      
    });
    return true;
  }
  
   funciono() {
    return this.flag;
  }
  traerTurnos() {
    return this.firestore.collection('Profesionales').snapshotChanges().pipe(map((clientes) => {
      return clientes.map((a) => {
        const data = a.payload.doc.data() as Cliente;
        // data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  async setTurnoUsuario(fechaSelect:string,idAuthProf:string,idAuthCurrenUser:string,infoProf:string) {
    let auxTurno:Turno = new Turno(fechaSelect,idAuthProf);
    auxTurno.info = infoProf;
    auxTurno.estado = "CONFIRMADO"
    auxTurno.resenia = "";
    auxTurno.encuesta = "";
    var auxTurnostring = JSON.stringify(auxTurno);
    var auxTurnoJSon = JSON.parse(auxTurnostring);
    await this.firestore.collection('Clientes').ref.where('idauth', '==', idAuthCurrenUser).get().then(async (documento) => {
   
      let auxCli = new Cliente(documento.docs[0].data().nombre,documento.docs[0].data().apellido,documento.docs[0].data().dni,documento.docs[0].data().foto,
      documento.docs[0].data().email,documento.docs[0].data().idauth);
      auxCli.turnos = [];

      if(documento.docs[0].data().turnos != "")
      {
         auxCli.turnos = JSON.parse(documento.docs[0].data().turnos);
           auxCli.turnos.push(auxTurnoJSon); 
        
          //  return "turno cargado con exito";
         
          //este agrega hay q descomentar
      }
      else {
        console.log("entro al else");
        console.log(auxTurnoJSon);
        console.log(auxCli.turnos);
        auxCli.turnos.push(auxTurnoJSon);
        
        // return "turno cargado con exito";
      }  
      this.firestore.collection('Clientes').doc(documento.docs[0].id).set({
        apellido:documento.docs[0].data().apellido,
        nombre: documento.docs[0].data().nombre,
        dni: documento.docs[0].data().dni,
        email: documento.docs[0].data().email,
        foto: documento.docs[0].data().foto,
        idauth: documento.docs[0].data().idauth,
        turnos: JSON.stringify(auxCli.turnos),
      })
      
    });
  }

  getClients() {
    return this.firestore.collection('Clientes').snapshotChanges().pipe(map((clientes) => {
      return clientes.map((a) => {
        const data = a.payload.doc.data() as Cliente;
        // data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  async setTurnoEstadoUsuario(fechaSelect:string, estado:string,idUsuario:string,idAuthProf:string,resenia:string) {
    
    // let auxTurno:Turno = new Turno(fechaSelect,idAuthProf);
    // auxTurno.estado = estado;
    // auxTurno.resenia = "";
    // var auxTurnostring = JSON.stringify(auxTurno);
    var auxTurnoJSon;
    await this.firestore.collection('Clientes').ref.where('idauth', '==', idUsuario).get().then(async (documento) => {
   
      let auxCli = new Cliente(documento.docs[0].data().nombre,documento.docs[0].data().apellido,documento.docs[0].data().dni,documento.docs[0].data().foto,
      documento.docs[0].data().email,documento.docs[0].data().idauth);
      auxCli.turnos = JSON.parse(documento.docs[0].data().turnos);
      // console.log(auxCli);
      console.log(auxCli.turnos);
      auxCli.turnos.forEach((turno,index)=> {
          console.log(index);
          let strTurno = JSON.stringify(turno);
          let arraystr = strTurno.split('"fecha":"');
          let auxfecha = arraystr[1].slice(0,16);
          
          if(auxfecha == fechaSelect) {
            console.log("hay una fecha que coincide");
            let auxTurno:Turno = new Turno(fechaSelect,idAuthProf);
            auxTurno.estado = estado;
            auxTurno.resenia = resenia;
            var auxTurnostring = JSON.stringify(auxTurno);
             auxTurnoJSon = JSON.parse(auxTurnostring);
           auxCli.turnos.splice(index,1);//borro el turno de ese indice 
           auxCli.turnos.push(auxTurnoJSon);
          }
      });
  
      this.firestore.collection('Clientes').doc(documento.docs[0].id).set({
        apellido:documento.docs[0].data().apellido,
        nombre: documento.docs[0].data().nombre,
        dni: documento.docs[0].data().dni,
        email: documento.docs[0].data().email,
        foto: documento.docs[0].data().foto,
        idauth: documento.docs[0].data().idauth,
        turnos: JSON.stringify(auxCli.turnos),
      })
      
    });
  }
  async setTurnoEstadoAndReseniaProfesional(fechaSelect:string, estado:string,idUsuario:string,idAuthProf:string,resenia:string)
   {
    var auxTurnoJSon;
    await this.firestore.collection('Profesionales').ref.where('idauth', '==', idAuthProf).get().then(async (documento) => {
   
      let auxPro = new Profesional(documento.docs[0].data().nombre,documento.docs[0].data().apellido,documento.docs[0].data().dni,documento.docs[0].data().foto,
      documento.docs[0].data().email,documento.docs[0].data().idauth,documento.docs[0].data().especialidad);
      auxPro.turnos = JSON.parse(documento.docs[0].data().turnos);
      // console.log(auxCli);
      console.log(auxPro.turnos);
      auxPro.turnos.forEach((turno,index)=> {
          console.log(index);
          let strTurno = JSON.stringify(turno);
          let arraystr = strTurno.split('"fecha":"');
          let auxfecha = arraystr[1].slice(0,16);
          
          if(auxfecha == fechaSelect) {
            console.log("hay una fecha que coincide");
            let auxTurno:Turno = new Turno(fechaSelect,idUsuario);
            auxTurno.estado = estado;
            auxTurno.resenia = resenia;
            var auxTurnostring = JSON.stringify(auxTurno);
             auxTurnoJSon = JSON.parse(auxTurnostring);
             auxPro.turnos.splice(index,1);//borro el turno de ese indice 
             auxPro.turnos.push(auxTurnoJSon);
          }
      });
  
      this.firestore.collection('Profesionales').doc(documento.docs[0].id).set({
        apellido:documento.docs[0].data().apellido,
        nombre: documento.docs[0].data().nombre,
        dni: documento.docs[0].data().dni,
        email: documento.docs[0].data().email,
        especialidad: documento.docs[0].data().especialidad,
        foto: documento.docs[0].data().foto,
        idauth: documento.docs[0].data().idauth,
        turnos: JSON.stringify(auxPro.turnos),
      })
      
    });
   }


   async setTurnoEncuestaUsuario(fechaSelect:string, estado:string,idUsuario:string,idAuthProf:string,resenia:string, encuesta:string[])
   {
    var auxTurnoJSon;
    await this.firestore.collection('Clientes').ref.where('idauth', '==', idUsuario).get().then(async (documento) => {
   
      let auxCli = new Cliente(documento.docs[0].data().nombre,documento.docs[0].data().apellido,documento.docs[0].data().dni,documento.docs[0].data().foto,
      documento.docs[0].data().email,documento.docs[0].data().idauth);
      auxCli.turnos = JSON.parse(documento.docs[0].data().turnos);
      // console.log(auxCli);
      console.log(auxCli.turnos);
      auxCli.turnos.forEach((turno,index)=> {
          console.log(index);
          let strTurno = JSON.stringify(turno);
          let arraystr = strTurno.split('"fecha":"');
          let auxfecha = arraystr[1].slice(0,16);
          
          if(auxfecha == fechaSelect) {
            console.log("hay una fecha que coincide");
            let auxTurno:Turno = new Turno(fechaSelect,idAuthProf);
            auxTurno.estado = estado;
            auxTurno.encuesta = encuesta.toString();
            auxTurno.resenia = resenia;
            var auxTurnostring = JSON.stringify(auxTurno);
             auxTurnoJSon = JSON.parse(auxTurnostring);
           auxCli.turnos.splice(index,1);//borro el turno de ese indice 
           auxCli.turnos.push(auxTurnoJSon);
          }
      });
  
      this.firestore.collection('Clientes').doc(documento.docs[0].id).set({
        apellido:documento.docs[0].data().apellido,
        nombre: documento.docs[0].data().nombre,
        dni: documento.docs[0].data().dni,
        email: documento.docs[0].data().email,
        foto: documento.docs[0].data().foto,
        idauth: documento.docs[0].data().idauth,
        turnos: JSON.stringify(auxCli.turnos),
      })
      
    });
   }

   async borrarTurnoUsuario(fechaSelect:string,idUsuario:string) {
    
    // let auxTurno:Turno = new Turno(fechaSelect,idAuthProf);
    // auxTurno.estado = estado;
    // auxTurno.resenia = "";
    // var auxTurnostring = JSON.stringify(auxTurno);
    var auxTurnoJSon;
    await this.firestore.collection('Clientes').ref.where('idauth', '==', idUsuario).get().then(async (documento) => {
   
      let auxCli = new Cliente(documento.docs[0].data().nombre,documento.docs[0].data().apellido,documento.docs[0].data().dni,documento.docs[0].data().foto,
      documento.docs[0].data().email,documento.docs[0].data().idauth);
      auxCli.turnos = JSON.parse(documento.docs[0].data().turnos);
      // console.log(auxCli);
      console.log(auxCli.turnos);
      auxCli.turnos.forEach((turno,index)=> {
          console.log(index);
          let strTurno = JSON.stringify(turno);
          let arraystr = strTurno.split('"fecha":"');
          let auxfecha = arraystr[1].slice(0,16);
          
          if(auxfecha == fechaSelect) {
            //console.log("hay una fecha que coincide");
            // let auxTurno:Turno = new Turno(fechaSelect,idAuthProf);
            // auxTurno.estado = estado;
            // auxTurno.resenia = resenia;
            // var auxTurnostring = JSON.stringify(auxTurno);
            //  auxTurnoJSon = JSON.parse(auxTurnostring);
           auxCli.turnos.splice(index,1);//borro el turno de ese indice 
          }
      });
  
      this.firestore.collection('Clientes').doc(documento.docs[0].id).set({
        apellido:documento.docs[0].data().apellido,
        nombre: documento.docs[0].data().nombre,
        dni: documento.docs[0].data().dni,
        email: documento.docs[0].data().email,
        foto: documento.docs[0].data().foto,
        idauth: documento.docs[0].data().idauth,
        turnos: JSON.stringify(auxCli.turnos),
      })
      
    });
   }

   async borrarTurnoProfesional(fechaSelect:string, idAuthProf:string)
   {
    var auxTurnoJSon;
    await this.firestore.collection('Profesionales').ref.where('idauth', '==', idAuthProf).get().then(async (documento) => {
   
      let auxPro = new Profesional(documento.docs[0].data().nombre,documento.docs[0].data().apellido,documento.docs[0].data().dni,documento.docs[0].data().foto,
      documento.docs[0].data().email,documento.docs[0].data().idauth,documento.docs[0].data().especialidad);
      auxPro.turnos = JSON.parse(documento.docs[0].data().turnos);
      // console.log(auxCli);
      console.log(auxPro.turnos);
      auxPro.turnos.forEach((turno,index)=> {
          console.log(index);
          let strTurno = JSON.stringify(turno);
          let arraystr = strTurno.split('"fecha":"');
          let auxfecha = arraystr[1].slice(0,16);
          
          if(auxfecha == fechaSelect) {
            // console.log("hay una fecha que coincide");
            // let auxTurno:Turno = new Turno(fechaSelect,idUsuario);
            // auxTurno.estado = estado;
            // auxTurno.resenia = resenia;
            // var auxTurnostring = JSON.stringify(auxTurno);
            //  auxTurnoJSon = JSON.parse(auxTurnostring);
             auxPro.turnos.splice(index,1);//borro el turno de ese indice 
             //auxPro.turnos.push(auxTurnoJSon);
          }
      });
  
      this.firestore.collection('Profesionales').doc(documento.docs[0].id).set({
        apellido:documento.docs[0].data().apellido,
        nombre: documento.docs[0].data().nombre,
        dni: documento.docs[0].data().dni,
        email: documento.docs[0].data().email,
        especialidad: documento.docs[0].data().especialidad,
        foto: documento.docs[0].data().foto,
        idauth: documento.docs[0].data().idauth,
        turnos: JSON.stringify(auxPro.turnos),
      })
      
    });
   }
}
