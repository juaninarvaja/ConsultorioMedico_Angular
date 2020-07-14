import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../servicios/auth.service';
import { Router } from "@angular/router";



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthService,public router : Router) { }

  ngOnInit() {
  }

  logOut() {
    this.auth.logOut();
    this.router.navigate(['/login'])
  }

}
