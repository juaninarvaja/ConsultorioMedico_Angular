import { Component, OnInit } from '@angular/core';
import { AuthService} from "../../servicios/auth.service";
import { Cliente } from 'src/app/clases/cliente';
import { UsuariosService } from "../../servicios/usuarios.service";
import { Profesional } from 'src/app/clases/profesional';
import { Recepcionista } from 'src/app/clases/recepcionista';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {
  contactoDiv:boolean = true;
  cargaCliente:boolean = false;
  cargaPro:boolean = false;
  cargaRecep:boolean = false;
  

  email:string;
  password:string;
  apellido:string = "";
  file:string = "";
  image64:any = "";
  dni:number = 0;
  name:string = "";
  msjError:string;
  EstadoCaptcha:boolean = false;
  type:string;



  constructor(private authService:AuthService,public usuariosService:UsuariosService) { }

  ngOnInit() {
  }

//#region altaClientes
  altaCliente() {
    console.log("esta en alta cliente");
    this.contactoParam(false);
    this.file = "";
    this.cargaCliente = true;
    this.cargaPro = false;
    this.cargaRecep = false;
  }
  regresar() {
    this.cargaCliente=false;
    this.cargaPro = false;
  }
  async aceptar() {
    console.log(this.email + this.password);
    let retorno = await this.authService.registerUser(this.email,this.password)
    .then(res => {
      
      this.msjError = "Usuario creado!";
      let auxCliente = new Cliente(this.name,this.apellido,this.dni,this.image64,this.email,res['user']['uid']);
      console.log(auxCliente);
      this.usuariosService.addCliente(auxCliente);
      this.cargaPro = false;
      this.cargaCliente = false;
      this.usuariosService.saveRolId("CLIENTE",res['user']['uid']);
      this.vaciarCampos();

      }).catch(err => this.msjError =  "Error! no se pudo crear, intente con una contraseña de mas de 6 caracteres y un mail valido");
    } 
    async changeListener($event) { 
      await this.readThis($event.target);
     }
  
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
      this.image64 = myReader.result;
    }
    myReader.readAsDataURL(file);
  }
  public resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.EstadoCaptcha = true;
    console.log(this.EstadoCaptcha);
    // this.armarDatos();
    }
  //#endregion

 
//#region contacto
contacto() {
  // this.contactoDiv = !(this.contactoDiv);
  this.contactoDiv = true;
  this.cargaPro = false;
  this.cargaCliente = false;
  this.cargaRecep = false;
}
contactoParam(valor:boolean) {
  this.contactoDiv = valor;
}
//#endregion

//#region alta Profesional
altaPro() {
  this.contactoParam(false);
  this.cargaPro = true;
  this.cargaRecep = false;
  this.cargaCliente = false;
  this.file = "";
}
async aceptarPro() {
  let retorno = await this.authService.registerUser(this.email,this.password)
  .then(res => {
    
    this.msjError =  "Profesional creado!";
    let auxPro = new Profesional(this.name,this.apellido,this.dni,this.image64,this.email,res['user']['uid'],this.type);
    console.log(auxPro);
    this.usuariosService.addPro(auxPro);
    this.usuariosService.saveRolId("PROFESIONAL",res['user']['uid']);
    this.cargaPro = false;
    this.vaciarCampos();


    }).catch(err => this.msjError =  "Error! no se pudo crear, intente con una contraseña de mas de 6 caracteres y un mail valido");
  } 

//#endregion
altaRec() {
  this.cargaRecep = true;
  this.contactoParam(false);
  this.cargaPro = false;
  this.cargaCliente = false;
  
}

async aceptarRec() {
  let retorno = await this.authService.registerUser(this.email,this.password)
  .then(res => {
    
    this.msjError =  "Recepcionista creado!";
    let auxRec = new Recepcionista(this.name,this.apellido,this.dni,this.image64,this.email,res['user']['uid']);
    console.log(auxRec);
    this.usuariosService.addRec(auxRec);
    this.usuariosService.saveRolId("RECEPCIONISTA",res['user']['uid']);
    this.vaciarCampos();


    }).catch(err => this.msjError =  "Error! no se pudo crear, intente con una contraseña de mas de 6 caracteres y un mail valido");
}
vaciarCampos()
{
  this.name = "";
  this.apellido = "";
  this.image64 = "";
  this.password = "";
  this.email = "";
}
}

