import { Component, OnInit, ɵConsole } from '@angular/core';
import { AuthService} from "../../servicios/auth.service";
import { UsuariosService } from "../../servicios/usuarios.service";
import { Router } from "@angular/router";
import { Cliente } from 'src/app/clases/cliente';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:string;
  password:string;
  apellido:string = "";
  file:string = "";
  image64:any = "";
  dni:number = 0;
  name:string = "";
  user;
  rolActual:string;
  mostrar=false;
  EstadoCaptcha:boolean = false;
  constructor(private authService:AuthService,public router : Router,public usuariosService:UsuariosService) { }

  ngOnInit() {

  }
  msjError:string;

 onSubmitLogin()
  {
    this.authService.login(this.email,this.password).then(res => {
        if(this.email == 'admin@admin.com')
        {
          this.router.navigate(['/homeAdm'])
        }
        else {
          let rol = this.authService.getRol().subscribe(data => {
            let rolUser = data.map(e => {
              return {
                id: e.payload.doc.id,
                idAuth: e.payload.doc.data()['idAuth'],
                rol: e.payload.doc.data()['rol'],
              };
            });
            const user = rolUser.find(user => user.idAuth === res['user']['uid']);
            this.rolActual = user.rol
            // this.publicRouter.navigate(['/home']);
          });
        }
        if(this.rolActual == "CLIENTE")
        {
          this.router.navigate(['/home']);
        } else if(this.rolActual == "PROFESIONAL")
        {
          this.router.navigate(['/homePro']);
        }  else if(this.rolActual == "RECEPCIONISTA")
        {
          this.router.navigate(['/homeRec']);
        }  
          
          // 
        
    //  }).catch(err => alert('los datos son incorrectos ono existe el usuario'));
  //  }).catch(err => this.router.navigate(['ventana-error']));
       
    }).catch(err => this.msjError =  "Error! verifique correo y/o contraseÃ±a");
  } 
  registrarse()
  {
    this.mostrar=true;
  }
  regresar() {
    this.mostrar=false;
  }
  async aceptar() {
    console.log(this.email + this.password);
    let retorno = await this.authService.registerUser(this.email,this.password)
    .then(res => {
      
      this.msjError =  "Usuario creado!";
      let auxCliente = new Cliente(this.name,this.apellido,this.dni,this.image64,this.email,res['user']['uid']);
      console.log(auxCliente);
      this.usuariosService.addCliente(auxCliente);
      this.usuariosService.saveRolId("CLIENTE",res['user']['uid']);

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


}
