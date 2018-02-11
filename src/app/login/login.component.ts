import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {User} from '../user';
import {$} from 'protractor';
import {SpotifyService} from '../angular5-spotify';
import { AuthContainer} from '../auth-container';
import {EventListener} from '@angular/core/src/debug/debug_node';

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

  openDialog (uri, name, options, cb) {
    let win = window.open(uri, name, options);

    let interval = window.setInterval(function () {
      try {
        if (!win || win.closed) {
          window.clearInterval(interval);
          cb(win);
        }
      } catch (e) {}
    }, 1000);
    return win;
  }

  getUsername(): void {
    this.user = this.loginService.getUsername();
  }

  onSubmit() {
    this.submitted = true;
    this.user.loggedIn = true; // change later
    this.getUsername();
    // console.log(JSON.stringify(this.user));
    console.log('Authenticating');
    this.getAuthentication();



    console.log(this.authContainer);
    console.log('Requesting Tokens');
    // this.spotifyService.requestTokens(this.authContainer.BON[2]).subscribe( data => console.log(data.toJson()));
    console.log('Done Requesting Tokens');
  }

  getAuthentication() {
    let params = {
      client_id: 'd4800b9ac98e4e09a15db22fc6a33f9f',
      redirect_uri: 'http://localhost:4200/callback',
      response_type: 'token'
    };

    let authCompleted = false;
    let authWindow = this.openDialog(
      'https://accounts.spotify.com/authorize?' + 'client_id=' + params.client_id +
      '&redirect_uri=' + params.redirect_uri + '&response_type=' + params.response_type,
      'Spotify',
        'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + 600 + ',height=' + 400 + ',top=' + 100 + ',left=' + 100,
      function () {

        console.log('Auth Callback');
        console.log('token: bitches!    ' + localStorage.getItem('spotify-token'));


      }
    );

  }


}
