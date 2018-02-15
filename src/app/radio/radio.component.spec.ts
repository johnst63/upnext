import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioComponent } from './radio.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {TracklistParsePipe} from '../tracklist-parse-pipe';
import {$} from 'protractor';

describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
          RadioComponent,
          TracklistParsePipe
        ],
      providers: [SpotifyService, HttpClient, HttpHandler],

      schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should search for abc',  async() => {

    expect($('#list').find('p').toBeEmpty());
  });
});
