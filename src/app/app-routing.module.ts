import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RadioComponent } from './radio/radio.component';
import {LoginComponent} from './login/login.component';
const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'radio', component: RadioComponent},
  {path: 'login', component: LoginComponent},
  {path: '', component: LoginComponent},



]
@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})

export class AppRoutingModule {}
