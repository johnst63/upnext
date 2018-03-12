import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {AppComponent} from '../app.component';
import {SpotifyService} from '../angular5-spotify';
import {LoginService} from '../login.service';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {Browser} from 'selenium-webdriver';
import {RadioComponent} from '../radio/radio.component';
import {CallbackComponent} from '../callback/callback.component';
import {LoginComponent} from '../login/login.component';
import {APP_BASE_HREF} from '@angular/common';
import {AppRoutingModule} from '../app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {TracklistParsePipe} from '../tracklist-parse-pipe';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {DataService} from '../data-service';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
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
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should update playlist', async(() => {
    let radfix = TestBed.createComponent(RadioComponent);
    let radcomp = radfix.componentInstance;

    //TODO login somehow

    radcomp.queryterm = 'somebody';
    fixture.detectChanges();
    setInterval(radcomp.onSearch, 3000);
    radcomp.onSearch();



  }));



});
