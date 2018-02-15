import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackComponent } from './callback.component';
import {RadioComponent} from '../radio/radio.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CallbackComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SpotifyService, HttpClient, HttpHandler],
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
