import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {RadioComponent} from '../radio/radio.component';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {AppComponent} from '../app.component';
import {TracklistParsePipe} from '../tracklist-parse-pipe';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let elem: HTMLElement;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent, TracklistParsePipe,
      ],
      providers: [SpotifyService, HttpClient, HttpHandler],

      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
