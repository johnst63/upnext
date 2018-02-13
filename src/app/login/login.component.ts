import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login.service';
import {User} from '../user';
import {SpotifyService} from '../angular5-spotify';
import { AuthContainer} from '../auth-container';
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


    console.log('Requesting Tokens');
    console.log('Done Requesting Tokens');
    this.router.navigate(['/home']);
  }





}
