import { Component, OnInit } from '@angular/core';
import {SpotifyService} from '../angular5-spotify';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {


        // login success

        let token = window.location.hash.split('&')[0].split('=')[1];
        // console.log('token' + token);
  //  this.spotifyService.token = token;
        localStorage.setItem('spotify-token', token);

    window.close();

  }

}
