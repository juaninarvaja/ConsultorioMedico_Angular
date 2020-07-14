import { Component, OnInit } from '@angular/core';
import {UsuariosService} from '../../servicios/usuarios.service';
import {AuthService} from '../../servicios/auth.service'

@Component({
  selector: 'app-home-rec',
  templateUrl: './home-rec.component.html',
  styleUrls: ['./home-rec.component.css']
})
export class HomeRecComponent implements OnInit {

  constructor(private usuarioService:UsuariosService, private authService:AuthService) { }

  mostrarTurnos= true;
  fechaActual:string;
  fechaMax:string;
  fechaSelect:any;
  mensajeFecha:string="";
  pedirTurno:boolean=false;
  arrayProfesionales=[];
  arrayClientes= [];
  auxCliente = null;
  profSelected:string;
  ClienteSelected:string;
  mensaje:string = "";
  verPedirTurno:boolean= true;
  VerMisTurnos:boolean =false;
  turnoJSON = [];
  turnoSelect = null;
  mostrarVerTurnos = false;

  async ngOnInit() {
    await this.obtenerInfo();
    this.restringeFechas();
    //this.getAllTurnos();
  }
//#region pedir turno
  agregarTurnos() {
    this.mostrarTurnos =true;
    this.mostrarVerTurnos = false;
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
  obtenerInfo()
  {
    this.obtenerPros();
    this.obtenerClis();
  }
  obtenerPros() {
    console.log("entro al obtener pros");
    this.usuarioService.getProfesionales().subscribe(async (profesionales) => {    
      // this.arrayClientes
      this.arrayProfesionales= [];
      profesionales.forEach(pro=> {
          this.arrayProfesionales.push(pro);    
      });
    });
  }
  obtenerClis() {
    this.usuarioService.getClientes().subscribe(async (clientes) => {    
      // this.arrayClientes
      this.arrayClientes= [];
      clientes.forEach(cli=> {
          this.arrayClientes.push(cli);    
      });
    });
  }
  async solicitarTurno() {
    let auxStr = this.profSelected.split(':');
    let auxStrCli = this.ClienteSelected.split(':');
     await this.usuarioService.setTurno(this.fechaSelect,auxStr[1],auxStrCli[1]);
    if(this.usuarioService.funciono()) {
      this.mensaje="El turno se asigno con exito";
      this.usuarioService.setTurnoUsuario(this.fechaSelect,auxStr[1],auxStrCli[1],auxStr[0]);
        //falta agregar el turno al usuario
    }
    else {
      this.mensaje= "El turno esta ocupado";
    }
  }
  //#endregion

  verTurnos()
  {
    this.mostrarTurnos = false;
    this.mostrarVerTurnos = true;
    this.turnoJSON = [];
    this.getAllTurnos();
  }
  getAllTurnos() {
    this.turnoJSON = [];
    this.usuarioService.getClients().subscribe(async (clientes) => {
      
      // this.arrayClientes
      clientes.forEach(pro=> {

          this.auxCliente = pro;

          if(this.auxCliente != null &&this.auxCliente.turnos != "")
          {
              let auxJson = JSON.parse(this.auxCliente.turnos);
              auxJson.forEach(element => {
                
                if(element.estado == "CONFIRMADO")
                {
                  this.arrayClientes.forEach(auxCli => {
                    if(auxCli.idauth == this.auxCliente.idauth)
                    {
                       element.idClienteEste = auxCli.idauth;
                      element.nombreCliente = auxCli.nombre;
                      element.apellidoCliente = auxCli.apellido;
                      this.turnoJSON.push(element);
                    }

                  });
                  //aca estaba el push
                  
                }
              
            });
          }
        });
        });
  }
  //borrar directamente de bd en clientes y en profesionales :(
  cancelarTurno(turno)
  {
    this.usuarioService.borrarTurnoUsuario(turno.fecha,turno.idClienteEste);
    this.usuarioService.borrarTurnoProfesional(turno.fecha,turno.idCliente);
    this.turnoJSON = [];
    this.getAllTurnos();
    this.mostrarVerTurnos = false;
    this.mostrarTurnos = true;
  }
}
