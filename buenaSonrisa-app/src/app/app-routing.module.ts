import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { HomeAdminComponent } from './componentes/home-admin/home-admin.component';
import { HomeRecComponent } from './componentes/home-rec/home-rec.component';
import { HomeProComponent } from './componentes/home-pro/home-pro.component';
import { AuthGuard } from './guards/auth.guard';
 

const routes: Routes = [
  { path: '', component:LoginComponent},
  { path: 'login', component:LoginComponent},
  { path: 'home', component:HomeComponent,canActivate:[AuthGuard]},
  { path: 'homeAdm', component:HomeAdminComponent,canActivate:[AuthGuard]},
  { path: 'homeRec', component:HomeRecComponent,canActivate:[AuthGuard]},
  { path: 'homePro', component:HomeProComponent,canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
