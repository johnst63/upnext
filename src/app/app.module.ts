import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { RadioComponent } from './radio/radio.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login.service';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { SpotifyService } from './angular5-spotify';
import {ActivatedRoute} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RadioComponent,
    LoginComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [LoginService, SpotifyService],
  bootstrap: [
    AppComponent,
  HomeComponent,
  RadioComponent,
    HeaderComponent,
  ]
})
export class AppModule {
}
