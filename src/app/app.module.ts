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
import {InterceptorModule} from '../interceptor.module';
import { CallbackComponent } from './callback/callback.component';
import {TracklistParsePipe} from './tracklist-parse-pipe';
import {DataService} from './data-service';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RadioComponent,
    LoginComponent,
    HeaderComponent,
    CallbackComponent,
    TracklistParsePipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    InterceptorModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  providers: [LoginService, SpotifyService, DataService],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {
}
