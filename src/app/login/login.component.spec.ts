import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {SpotifyService} from '../angular5-spotify';
import {AppComponent} from '../app.component';
import {RadioComponent} from '../radio/radio.component';
import {CallbackComponent} from '../callback/callback.component';
import {HomeComponent} from '../home/home.component';
import {HeaderComponent} from '../header/header.component';
import {APP_BASE_HREF} from '@angular/common';
import {AppRoutingModule} from '../app-routing.module';
import {InterceptorModule} from '../../interceptor.module';
import {BrowserModule} from '@angular/platform-browser';
import {LoginService} from '../login.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeComponent,
        RadioComponent,
        LoginComponent,
        HeaderComponent,
        CallbackComponent,
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        InterceptorModule
      ],
      providers: [LoginService, SpotifyService,
        {provide: APP_BASE_HREF, useValue: '/'}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
