import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {RadioComponent} from '../radio/radio.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {LoginService} from '../login.service';
import {SpotifyService} from '../angular5-spotify';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {AppRoutingModule} from '../app-routing.module';
import {HomeComponent} from '../home/home.component';
import {CallbackComponent} from '../callback/callback.component';
import {TracklistParsePipe} from '../tracklist-parse-pipe';
import {APP_BASE_HREF} from '@angular/common';
import {AppComponent} from '../app.component';
import {DataService} from '../data-service';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {HeaderComponent} from '../header/header.component';
import {BrowserModule} from '@angular/platform-browser';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {FormsModule} from '@angular/forms';
import {InterceptorModule} from '../../interceptor.module';

class RouterStub {
  navigateByUrl(url: string) { return url; }
}
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
      providers: [LoginService, SpotifyService, DataService,
        {provide: APP_BASE_HREF, useValue: '/'}],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    let router = fixture.debugElement.injector.get(Router);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

  it('should get an auth token', async() => {
    setInterval(this.spotifyService.authenticate, 3000);
    this.spotifyService.authenticate();

    expect(localStorage.getItem('spotify-token')).toBe('undefined');


  });


});
