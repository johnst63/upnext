import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {RadioComponent} from '../radio/radio.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {LoginService} from '../login.service';
import {SpotifyService} from '../angular5-spotify';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {AppRoutingModule} from '../app-routing.module';
import {HomeComponent} from '../home/home.component';
import {CallbackComponent} from '../callback/callback.component';
import {TracklistParsePipe} from '../tracklist-parse-pipe';
import {APP_BASE_HREF} from '@angular/common';

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
        LoginComponent, HomeComponent, RadioComponent, CallbackComponent, TracklistParsePipe,
      ],
      imports: [AppRoutingModule],
      providers: [LoginService, SpotifyService, HttpClient, HttpHandler,
        {provide: APP_BASE_HREF, useValue: '/'},

  ],
      schemas: [NO_ERRORS_SCHEMA],
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
  it('should navigate to login', async() => {

    component.onTest();
    expect(HomeComponent).toBeTruthy();
  });
  it('should get an auth token', async() => {
    component.onTest();


  });


});
