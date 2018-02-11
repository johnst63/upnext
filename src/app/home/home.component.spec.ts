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
import {InterceptorModule} from '../../interceptor.module';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {TracklistParsePipe} from '../tracklist-parse-pipe';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

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

      ],
      providers: [LoginService, SpotifyService,
        {provide: APP_BASE_HREF, useValue: '/'}],

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
});
