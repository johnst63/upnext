import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {User} from '../user';
import {$} from 'protractor';
import {SpotifyService} from '../angular5-spotify';
import { AuthContainer} from '../auth-container';
import {EventListener} from '@angular/core/src/debug/debug_node';
import {rootRoute} from '@angular/router/src/router_module';
import {Router} from '@angular/router';

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
  constructor(private loginService: LoginService, private spotifyService: SpotifyService, private router: Router) {

  }
  get diagnostic() { return JSON.stringify(this.user); }

  ngOnInit() {
  this.getUsername();
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
    this.spotifyService.authenticate();


    console.log(this.authContainer);
    console.log('Requesting Tokens');
    // this.spotifyService.requestTokens(this.authContainer.BON[2]).subscribe( data => console.log(data.toJson()));
    console.log('Done Requesting Tokens');
    this.router.navigate(['/home']);
  }





}
