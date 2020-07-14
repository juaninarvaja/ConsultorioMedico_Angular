import { Injectable } from '@angular/core';
import {AngularFireAuth}from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { JwtHelper } from "angular2-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private AFauth: AngularFireAuth,private firestore: AngularFirestore) {}
  jwtHelper: JwtHelper = new JwtHelper();

  login(email:string,password:string) {
    
    return new Promise((resolve,rejected) =>{
      this.AFauth.auth.signInWithEmailAndPassword(email,password).then(user => {
        
        user.user.getIdToken().then(function (token) {
          localStorage.setItem('token', token);
          // this.router.navigate(['/']);
        });
        resolve(user);
      }).catch(err => rejected(err));
    });
  }
  registerUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.AFauth.auth.createUserWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData))
        .catch(err => reject(err));
    });
  }
  logOut() {
    this.AFauth.auth.signOut().then(function() {
      // Sign-out successful.
      localStorage.removeItem('token');
    }).catch(function(error) {
      // An error happened.
    });
  }
  getRol()
  {
    return this.firestore.collection('Rol_IdAuth').snapshotChanges();
  }
  // obtenerUsuarioActivo() {
  //   return this.AFauth.auth.currentUser.email.toString();
  
  //   }
  currentUserId() {
    return this.AFauth.auth.currentUser.uid;
  }
  isAuthenticated() {
    let token = localStorage.getItem("token");
    // console.log(token);
    return token && !this.jwtHelper.isTokenExpired(token);

  }
}
