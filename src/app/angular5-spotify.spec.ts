import {before} from 'selenium-webdriver/testing';
import { SpotifyService} from './angular5-spotify';
import {HeaderComponent} from './header/header.component';
import {HttpClientModule} from '@angular/common/http';
import {APP_BASE_HREF} from '@angular/common';
import {LoginService} from './login.service';
import {RadioComponent} from './radio/radio.component';
import {async, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('angular5-spotify', () => {
  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [SpotifyService],

      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

});
