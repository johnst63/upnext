import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RadioComponent } from './radio/radio.component';
const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'radio', component: RadioComponent},


]
@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})

export class AppRoutingModule {}
