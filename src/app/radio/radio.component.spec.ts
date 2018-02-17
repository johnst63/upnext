import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {RadioComponent} from './radio.component';
import {SpotifyService} from '../angular5-spotify';
import {AppComponent} from '../app.component';
import {CallbackComponent} from '../callback/callback.component';
import {HomeComponent} from '../home/home.component';
import {LoginComponent} from '../login/login.component';
import {HeaderComponent} from '../header/header.component';
import {APP_BASE_HREF, JsonPipe} from '@angular/common';
import {AppRoutingModule} from '../app-routing.module';
import {InterceptorModule} from '../../interceptor.module';
import {BrowserModule} from '@angular/platform-browser';
import {LoginService} from '../login.service';
import {HttpClientModule, JsonpClientBackend} from '@angular/common/http';
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
import {TrackSearchResults} from '../models/track';
import {JSONPBackend} from '@angular/http';
import {forEach} from '@angular/router/src/utils/collection';
import createSpyObj = jasmine.createSpyObj;


describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;
  let de: DebugElement;
  let elem: HTMLElement;
  let service: SpotifyService;
  let spy: any;

  let database: any = require('../mock/search.json');


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
  it('should authenticate ', async(() => {
    let spy = spyOn(component.spotifyService, 'authenticate');
    setInterval(component.spotifyService.authenticate, 5000);
    component.spotifyService.authenticate();
    expect(component.spotifyService.authenticate).toHaveBeenCalled();
  }));
  it('should get search results back ', async(() => {

    setInterval(component.spotifyService.authenticate, 5000);
    component.spotifyService.authenticate();
    component.queryterm = 'abc';
    fixture.detectChanges();
    setInterval(component.onSearch, 2000);
    component.onSearch();
    fixture.detectChanges();

    expect(component.trackSearchResults).toBeDefined();
  }));
});

