import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {RadioComponent} from './radio.component';
import {SpotifyService} from '../angular5-spotify';
import {AppComponent} from '../app.component';
import {CallbackComponent} from '../callback/callback.component';
import {HomeComponent} from '../home/home.component';
import {LoginComponent} from '../login/login.component';
import {HeaderComponent} from '../header/header.component';
import {APP_BASE_HREF, JsonPipe} from '@angular/common';
import {AppRoutingModule} from '../app-routing.module';
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
      setInterval(component.spotifyService.authenticate, 5000);
      component.spotifyService.authenticate();
      fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should open the login window', async(() => {
    spyOn(window, 'open');
    setInterval(component.spotifyService.authenticate, 3000);

    component.spotifyService.authenticate();
    fixture.detectChanges();
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
  }));
  it('should authenticate ', async(() => {
    let spy = spyOn(component.spotifyService, 'authenticate');
 //   setInterval(component.spotifyService.authenticate, 5000);
    component.spotifyService.authenticate();
    expect(component.spotifyService.authenticate).toHaveBeenCalled();
  }));

  //TODO the auth token should be static in order to properly test this. End to end would need to be used for more spotify calls
  // it('should get search results back ', async(() => {
  //
  //   // setInterval(component.spotifyService.authenticate, 5000);
  //   // component.spotifyService.authenticate();
  //   component.queryterm = 'abc';
  //   fixture.detectChanges();
  //   setInterval(component.onSearch, 2000);
  //   component.onSearch();
  //   fixture.detectChanges();
  //
  //   //TODO figure out alternative to this
  //   console.log(component.trackSearchResults);
  //   expect(component.trackSearchResults).toBeTruthy();
  // }));
  it('should authenticate when error 401 occurs', async(() => {
    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    component.queryterm = 'lose';
    fixture.detectChanges();
    console.log(component.spotifyService);
    spyOn(component.spotifyService, 'authenticate');
    component.spotifyService.authenticate();
    setInterval(component.onSearch, 3000);
    component.onSearch();
    expect(component.spotifyService.authenticate).toHaveBeenCalled();
    setInterval(component.onSearch, 2000);
    component.onSearch();

    //TODO figure out alternative to this
    expect(component.trackSearchResults).toBeFalsy();

  }));
});
