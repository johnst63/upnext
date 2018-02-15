import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {SpotifyService} from '../angular5-spotify';
import {Router} from '@angular/router';
import {SpotifyUser, User} from '../models/user.interface';
import {DataService} from '../data-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  submitted = false;
  spotifyUser: SpotifyUser; //holds spotify id
  user: User;

  constructor(private loginService: LoginService, private spotifyService: SpotifyService, private router: Router, private dataService: DataService) {

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
    this.spotifyService.getUserInfo().subscribe((data: SpotifyUser) => {
      this.spotifyUser = data,
      this.dataService.updateData(this.spotifyUser);
    });

  }





}
