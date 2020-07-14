import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../servicios/auth.service";
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private firebaseService:AuthService, private router: Router){}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.firebaseService.isAuthenticated()){
        return true;
      }
      else{
        console.log("el guard no deja qe pases");
         this.router.navigate(['login']);
         return false;
       }
  }
}