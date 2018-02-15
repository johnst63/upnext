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
        InterceptorModule
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
    service = component.spotifyService;
    elem = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should authenticate ', () => {

    //service.authenticate();
    component.queryterm = 'abc';
    fixture.detectChanges();

   expect().nothing();
  });
});
