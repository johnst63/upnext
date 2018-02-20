import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackComponent } from './callback.component';
import {RadioComponent} from '../radio/radio.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {AppComponent} from '../app.component';
import {DataService} from '../data-service';
import {HomeComponent} from '../home/home.component';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule} from 'angularfire2';
import {TracklistParsePipe} from '../tracklist-parse-pipe';
import {AppRoutingModule} from '../app-routing.module';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {HeaderComponent} from '../header/header.component';
import {LoginComponent} from '../login/login.component';
import {LoginService} from '../login.service';
import {BrowserModule} from '@angular/platform-browser';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {FormsModule} from '@angular/forms';
import {InterceptorModule} from '../../interceptor.module';
import {APP_BASE_HREF} from '@angular/common';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;

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
    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
