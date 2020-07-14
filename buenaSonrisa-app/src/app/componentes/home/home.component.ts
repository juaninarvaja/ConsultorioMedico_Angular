import { Component, OnInit } from '@angular/core';
import {UsuariosService} from '../../servicios/usuarios.service'
import {AuthService} from '../../servicios/auth.service'
import { Profesional } from 'src/app/clases/profesional';
import { Cliente } from 'src/app/clases/cliente';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private usuarioService:UsuariosService, private authService:AuthService) { }
  fechaActual:string;
  fechaMax:string;
  fechaSelect:any;
  mensajeFecha:string="";
  pedirTurno:boolean=false;
  arrayProfesionales=[];
  auxCliente = null;
  profSelected:string;
  mensaje:string = "";
  verPedirTurno:boolean= true;
  VerMisTurnos:boolean =false;
  turnoJSON = [];
  turnosTerminadosJSON = [];
  turnoSelect = null;
  mostrarEncuesta= false;
  valorClinica='';
  valorEspecialista='';
  encuestaDatos= '';

  async ngOnInit() {
    await this.obtenerPros();
    this.restringeFechas();
    this.cargarTurnos();
  }

 // #region pedir turnos
  obtenerPros() {
    

    this.usuarioService.getProfesionales().subscribe(async (profesionales) => {
      
      // this.arrayClientes
      this.arrayProfesionales= [];
      profesionales.forEach(pro=> {
        
  
          this.arrayProfesionales.push(pro);
        
      });
     
    });
    
  }



  restringeFechas() {
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
    this.fechaMax = dateYear + '-12-31';
  }

  fechaSeleccionada() {
    let esValida:Boolean = true;
    let fechaSelectDate = new Date(this.fechaSelect);
    if(fechaSelectDate.getHours() < 8) {
      this.mensajeFecha="el horario de atencion comienza 8hs :)";
      this.pedirTurno = false;
    }
    else if(fechaSelectDate.getDay() > 0 && fechaSelectDate.getDay() <6 && fechaSelectDate.getHours() > 19) 
    {
      this.mensajeFecha="dias habiles atendemos de 8hs a 19hs :)";
      this.pedirTurno = false;
    }
    else if(fechaSelectDate.getDay() == 0){
      this.mensajeFecha="No atendemos los domingos :)";
      this.pedirTurno = false;
    }
    else if(fechaSelectDate.getDay()==6 && fechaSelectDate.getHours() > 14  ) {
      this.mensajeFecha="Los sabados atendemos de 8 a 14 hs :)";
      this.pedirTurno = false;
  }
  else if(fechaSelectDate.getMinutes() != 0 && fechaSelectDate.getMinutes() != 15 && 
  fechaSelectDate.getMinutes() != 30 && fechaSelectDate.getMinutes() != 45) {
    this.mensajeFecha="Los turnos se solicitan cada 15 minutos xx:00 , xx:15, xx:30, xx:45 :)";
    this.pedirTurno = false;
  }
  else {
      this.mensajeFecha= "Fecha valida";
      this.pedirTurno=true;
        }
  }

  async solicitarTurno() {
    let auxStr = this.profSelected.split(':');
     await this.usuarioService.setTurno(this.fechaSelect,auxStr[1],this.authService.currentUserId());
    if(this.usuarioService.funciono()) {
      this.mensaje="El turno se asigno con exito";
      this.usuarioService.setTurnoUsuario(this.fechaSelect,auxStr[1],this.authService.currentUserId(),auxStr[0]);
        //falta agregar el turno al usuario
    }
    else {
      this.mensaje= "El turno esta ocupado";
    }
  
  }
  pedirTurnoF() {
    this.verPedirTurno = true;
    this.VerMisTurnos=false;
  }
  //#endregion 
  pedirMisTurno()
  {
    this.verPedirTurno = false;
    this.VerMisTurnos = true;
    this.cargarTurnos();
  
    

  }
  cargarTurnos(){
    this.usuarioService.getClients().subscribe(async (clientes) => {
      
      // this.arrayClientes
      clientes.forEach(pro=> {

      
        if(pro.idauth == this.authService.currentUserId())
        {
          this.auxCliente = pro;
        }
        
      });
      if(this.auxCliente != null &&this.auxCliente.turnos != "")
      {
          let auxJson = JSON.parse(this.auxCliente.turnos);
          this.turnoJSON = [];
          this.turnosTerminadosJSON = [];
           auxJson.forEach(element => {
            
            if(element.estado == "CONFIRMADO")
            {
              this.turnoJSON.push(element);
            }
            if(element.estado == "ATENDIDO") {
              this.turnosTerminadosJSON.push(element);
            }
           
        });
      }
     
    });
  }
  encuesta(turno) {
    this.turnoSelect = turno;
    this.encuestaDatos= "";
    this.mostrarEncuesta = true;
  }
  regresar() {
    this.mostrarEncuesta=false;
  }
  aceptar() {
    this.mostrarEncuesta=false;
    console.log(this.turnoSelect);
    // console.log(this.encuestaDatos);
    // console.log(this.valorClinica);
    // console.log(this.valorEspecialista);
    let array = [this.valorClinica,this.valorEspecialista,this.encuestaDatos];
   
    this.usuarioService.setTurnoEncuestaUsuario(this.turnoSelect.fecha,"ATENDIDO",this.authService.currentUserId(),this.turnoSelect.idCliente,this.turnoSelect.resenia, array)
    //guardar opinion y valores
  }
}
