import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import {AppComponent} from '../app.component';
import {RouterLink, RouterModule} from '@angular/router';
import {SpotifyService} from '../angular5-spotify';
import {RadioComponent} from '../radio/radio.component';
import {CallbackComponent} from '../callback/callback.component';
import {HomeComponent} from '../home/home.component';
import {LoginComponent} from '../login/login.component';
import {APP_BASE_HREF} from '@angular/common';
import {AppRoutingModule} from '../app-routing.module';
import {InterceptorModule} from '../../interceptor.module';
import {BrowserModule, By} from '@angular/platform-browser';
import {LoginService} from '../login.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {TracklistParsePipe} from '../tracklist-parse-pipe';
import {$} from 'protractor';
import {DebugElement} from '@angular/core';
import {DataService} from '../data-service';
import {AngularFireDatabase, AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule, FirebaseApp} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {environment} from '../../environments/environment';
import {detectChanges} from '@angular/core/src/render3';


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let elem: HTMLElement;
  let de: DebugElement;
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

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to login', function () {
    let de = fixture.debugElement;
    de = fixture.debugElement.query(By.css('#login'));
    let elem = de.nativeElement;

    expect(elem.textContent).toContain('Login');

    let loginfix = TestBed.createComponent(LoginComponent);

    expect(component).toBeTruthy();
    expect(loginfix).toBeTruthy();
    de = loginfix.debugElement.query(By.css('button'));
    elem = de.nativeElement;
    expect(elem.textContent).toContain('Login Here');
  });

  it('should navigate to radio', function () {
    de = fixture.debugElement.query(By.css('#radio'));
    let elem = de.nativeElement;

    expect(elem.textContent).toContain('Radio');

    let radfix = TestBed.createComponent(RadioComponent);
    fixture.detectChanges();
    radfix.detectChanges();
    expect(component).toBeTruthy();

    expect(radfix).toBeTruthy();
    de = radfix.debugElement.query(By.css('#tracks_dne'));
    elem = de.nativeElement;
    expect(elem.textContent).toContain(' No Tracks Found ');
  });

  it('should navigate to home', function () {
    de = fixture.debugElement.query(By.css('#home'));
    let elem = de.nativeElement;

    expect(elem.textContent).toContain('Home');

    let homfix = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    homfix.detectChanges();
    expect(component).toBeTruthy();

    expect(homfix).toBeTruthy();
    de = homfix.debugElement.query(By.css('[id=debugSelector]'));
    elem = de.nativeElement;
    expect(elem.textContent).toContain(' No Tracks Found ');
  });
  it('should navigate to home from navbrand', function () {
    de = fixture.debugElement.query(By.css('#apphome'));
    let elem = de.nativeElement;

    expect(elem.textContent).toContain('UpNext');

    let homfix = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    homfix.detectChanges();
    expect(component).toBeTruthy();

    expect(homfix).toBeTruthy();
    de = homfix.debugElement.query(By.css('[id=debugSelector]'));
    elem = de.nativeElement;
    expect(elem.textContent).toContain(' No Tracks Found ');

  });
});
