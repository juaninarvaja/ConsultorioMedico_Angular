import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';

// import { PruebaCaptchaComponent } from './componentes/prueba-captcha/prueba-captcha.component';
import { AngularFireModule } from "@angular/fire";
import {AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { QRCodeModule } from 'angular2-qrcode';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatInputModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import { HomeComponent } from './componentes/home/home.component';
import { HomeAdminComponent } from './componentes/home-admin/home-admin.component';
import { HeaderComponent } from './componentes/header/header.component';
import { HomeProComponent } from './componentes/home-pro/home-pro.component';
import { HomeRecComponent } from './componentes/home-rec/home-rec.component';
import {FullCalendarModule} from 'primeng/fullcalendar';
import {MatSliderModule} from '@angular/material/slider';



var datos =    {
  apiKey: "AIzaSyA02Vj3uzYvZ8oUWIe98YrT9_W62w4DMs8",
  authDomain: "buenasonrisa-fe34b.firebaseapp.com",
  databaseURL: "https://buenasonrisa-fe34b.firebaseio.com",
  projectId: "buenasonrisa-fe34b",
  storageBucket: "buenasonrisa-fe34b.appspot.com",
  messagingSenderId: "933192168237",
  appId: "1:933192168237:web:023bff5e7aaeca264fd9a4",
  measurementId: "G-L3XNYFQ61B"
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HomeAdminComponent,
    HeaderComponent,
    HomeProComponent,
    HomeRecComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RecaptchaModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(datos),
    AngularFireAuthModule,
    QRCodeModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    FullCalendarModule,MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
