import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioComponent } from './radio.component';
import {SpotifyService} from '../angular5-spotify';
import {AppComponent} from '../app.component';
import {CallbackComponent} from '../callback/callback.component';
import {HomeComponent} from '../home/home.component';
import {LoginComponent} from '../login/login.component';
import {HeaderComponent} from '../header/header.component';
import {APP_BASE_HREF} from '@angular/common';
import {AppRoutingModule} from '../app-routing.module';
import {InterceptorModule} from '../../interceptor.module';
import {BrowserModule} from '@angular/platform-browser';
import {LoginService} from '../login.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {TracklistParsePipe} from '../tracklist-parse-pipe';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {$, by, element} from 'protractor';
import {DataService} from '../data-service';
import {AngularFireDatabase, AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule, FirebaseApp} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {environment} from '../../environments/environment';



describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;
  let de: DebugElement;
  let elem: HTMLElement;
  let service: SpotifyService;
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    // service = component.spotifyService;
    elem = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });
  it('should open the login window', function () {
    spyOn(window, 'open');

    component.spotifyService.authenticate();

    let w = 400,
      h = 500,
      left = (screen.width / 2) - (w / 2),
      top = (screen.height / 2) - (h / 2);

    let params = {
      client_id: null,
      redirect_uri: null,
      scope: '',
      response_type: 'token'
    };
    expect(window.open).toHaveBeenCalled();
    // expect(window.open).toHaveBeenCalledWith('https://accounts.spotify.com/authorize?' + service.toQueryString(params),
    //   'Spotify',
    //   'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left);
  });
  it('should authenticate ', async() => {

    component.spotifyService.authenticate();

    //TODO use interval here maybe ************************

    component.queryterm = 'abc';
    fixture.detectChanges();
    component.onSearch();
   expect().nothing();
  });
});

