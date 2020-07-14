import { Component, OnInit } from '@angular/core';
import {UsuariosService}from '../../servicios/usuarios.service';
import {AuthService} from '../../servicios/auth.service'



@Component({
  selector: 'app-home-pro',
  templateUrl: './home-pro.component.html',
  styleUrls: ['./home-pro.component.css']
})
export class HomeProComponent implements OnInit {

  constructor(private usuariosService:UsuariosService,private authService:AuthService) { }
  mostrarCrono = false;
  contactoDiv= false;
  fechaSelect:string;
  fechaActual;
  auxProf = null;
  auxCliente = null;
  turnoJSON = [];
  resenia= "";
  mostrarResenia = false;
  auxTurnoClickeado = null;
  ngOnInit() {
    var dateDay = new Date().getDate();
    var dateMonth = new Date().getMonth() + 1;
    var dateYear = new Date().getFullYear();
    if(dateDay <10 && dateMonth >=10)
    {
      this.fechaActual= dateYear +  '-' + dateMonth + '-0' + dateDay;
    }
    else if (dateMonth <10 && dateDay >=10){
      this.fechaActual= dateYear +  '-0' + dateMonth + '-' + dateDay;
    }
    else if(dateMonth <10 && dateDay <10) {
      this.fechaActual= dateYear +  '-0' + dateMonth + '-0' + dateDay;
    }
    else
    {
      this.fechaActual= dateYear + '-' + dateMonth + '-' + dateDay;
    }
    this.fechaSelect = this.fechaActual;
    this.verCrono();
    this.fechaSeleccionada();
    
  }
  verCrono() {
    this.mostrarCrono = true;
    this.contactoDiv = false;
  }
  contacto() {
    // this.contactoDiv = !(this.contactoDiv);
    this.contactoDiv = true;
    this.mostrarCrono = false;
  }
  contactoParam(valor:boolean) {
    this.contactoDiv = valor;
  }
  fechaSeleccionada()
  {
    
    console.log(this.fechaSelect);
    this.usuariosService.traerTurnos().subscribe(async (clientes) => {
      this.turnoJSON = [];
      // this.arrayClientes
      clientes.forEach(pro=> {

      
        if(pro.idauth == this.authService.currentUserId())
        {
          this.auxProf = pro;
        }
        
      });

      if(this.auxProf!= null &&this.auxProf.turnos != "")
      {
          let auxJson = JSON.parse(this.auxProf.turnos); //me traigo los trurnos del profesional
          this.turnoJSON = [];
       
           auxJson.forEach(element => {   //recorro los trurnos
    
              let strFecha:string = JSON.stringify(element.fecha);
              let auxArrayFecha = strFecha.split('T');
              
              if(auxArrayFecha[0].slice(1) == this.fechaSelect)
              {
             
                this.usuariosService.getClients().subscribe(async (clientes) => {
                
                  clientes.forEach(pro=> {


                    if(pro.idauth == element.idCliente)
                    {
                      this.auxCliente = pro;
    
                    }                  
                  });

                  if(this.auxCliente != null)
                  {

                    element.cliente = this.auxCliente;
                    
                    let jsonTurnoauxCLiente = JSON.parse(this.auxCliente.turnos);
                    jsonTurnoauxCLiente.forEach(elementAux => {
                      if(elementAux.fecha == element.fecha && auxJson[this.turnoJSON.length] != undefined)
                      {
                        element.estado = elementAux.estado;
                        this.turnoJSON.push(element);
                        
                      }
                      this.auxCliente = null;
                    });
                  }
     
                  //aca esstaba el push
                
              });

            
          // });
        }
        //console.log(this.turnoJSON);
          });

      
        }
      });
  }

    atender(turno:any){
      this.resenia="";
      console.log(turno.estado);
      this.mostrarResenia = true;
      this.auxTurnoClickeado = turno;
    }
    //tengo que cambiar el estado tanto en el rpfesional como en el cliente 

      //despues permite cargar un breve reseña de los trabajos realizados en el paciente.
    confirmarResenia()
    {
      console.log(this.auxTurnoClickeado);
      this.mostrarResenia = false;
      console.log(this.resenia);
       //cambiarEstadoCliente 
      this.usuariosService.setTurnoEstadoUsuario(this.auxTurnoClickeado.fecha,"ATENDIDO",this.auxTurnoClickeado.idCliente,this.authService.currentUserId(),this.resenia);
      //cambiarEstadoProfesional && cambiarResenia profesional
      this.usuariosService.setTurnoEstadoAndReseniaProfesional(this.auxTurnoClickeado.fecha,"ATENDIDO",this.auxTurnoClickeado.idCliente,this.authService.currentUserId(),this.resenia);
      this.turnoJSON = [];
   }
    cancelarResenia() {
      this.mostrarResenia = false;
    }
}
