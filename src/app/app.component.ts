import {Component, ViewChild} from '@angular/core';
import {LoginService} from './login.service';
import {SpotifyUser} from './models/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent    {
  title = 'UpNext';
   client_id = 'd4800b9ac98e4e09a15db22fc6a33f9f'; // Your client id
   client_secret = 'c1988f4fc8f347918e0ac41b7409163b'; // Your secret
   redirect_uri = 'http://localhost:4200/callback'; // Your redirect uri



}
