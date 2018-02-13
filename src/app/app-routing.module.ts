import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RadioComponent } from './radio/radio.component';
import {LoginComponent} from './login/login.component';
import {CallbackComponent} from './callback/callback.component';
const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'radio', component: RadioComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}, //generally don't want to have two paths to the same component, so using redirect to go to the component instead.
  {path: 'callback', component: CallbackComponent},



];
@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})

export class AppRoutingModule {}
