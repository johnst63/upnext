import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {User} from '../user';
import {$} from 'protractor';
import {SpotifyService} from '../angular5-spotify';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  submitted = false;
  results;
  stringResults: string;
  user: User;
  constructor(private loginService: LoginService, private spotifyService: SpotifyService) {

  }
  get diagnostic() { return JSON.stringify(this.user); }

  ngOnInit() {
  this.getUsername();
  }

  getUsername(): void {
    this.user = this.loginService.getUsername();
  }
  // getUsername(): void {
  //   this.loginService.getUsername()
  //     .subscribe(user => this.user = user);
  // }

  onSubmit() {
    this.submitted = true;
    this.user.loggedIn = true; // change later
    this.getUsername();
    console.log(JSON.stringify(this.user));
    console.log('Authenticating');
    this.results = this.spotifyService.authenticate();
    console.log(this.results);
    console.log('Requesting Tokens');
    // this.spotifyService.requestTokens();
    console.log('Done Requesting Tokens');
  }



}
