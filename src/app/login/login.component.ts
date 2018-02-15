import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {SpotifyService} from '../angular5-spotify';
import { AuthContainer} from '../auth-container';
import {Router} from '@angular/router';
import {SpotifyUser, User} from '../models/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  submitted = false;
  spotifyUser: SpotifyUser; //holds spotify id
  user: User;
  @Output() obtainUserID = new EventEmitter <SpotifyUser>();
  private; authContainer: AuthContainer;
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
    this.spotifyService.getUserInfo().subscribe((data: SpotifyUser) => this.spotifyUser = data);
    this.spotifyService.getUserPlaylists().subscribe(data => console.log(data));
    this.obtainUserID.emit(this.spotifyUser);
  }





}
