import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';
import { RadioComponent } from './radio/radio.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RadioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  HomeComponent,
  RadioComponent,
  ]
})
export class AppModule { }
