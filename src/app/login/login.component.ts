import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {User} from '../user';
import {$} from 'protractor';
import {SpotifyService} from '../angular5-spotify';
import { AuthContainer} from '../auth-container';

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
  private authContainer: AuthContainer;
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
    // console.log(JSON.stringify(this.user));
    console.log('Authenticating');
    this.getAuthentication();
    // this.results = this.spotifyService.authenticate().subscribe( data => this.authContainer = {
    //   client: data['client'],
    //   BON: data['BON']
    // });
    // this.results = this.spotifyService.authenticate().subscribe( data => console.log(JSON.stringify(data)));

    console.log(this.authContainer);
    console.log('Requesting Tokens');
    // this.spotifyService.requestTokens(this.authContainer.BON[0]);
    console.log('Done Requesting Tokens');
  }

  getAuthentication() {
    this.results = this.spotifyService.authenticate().subscribe( data => this.authContainer = {
      client: data['client'],
      BON: data['BON']
    });
  }

}
