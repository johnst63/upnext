import { Component, OnInit } from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {get} from 'http';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent extends HTMLElement implements OnInit {
  private _target: any;

  constructor(private spotifyService: SpotifyService) {
    super();
  }



  ngOnInit() {
    function connectedCallback() {
      if (!this.hasAttribute('manual')) {
        this.receive();
        window.addEventListener('storage', e => this.receiveStorage(e), true);
      }
    }

    function receive() {
      console.log('receiving');
      const query = new URLSearchParams(document.location.search);
      const code = query.get('code');
      const error = query.get('error');
      const state = query.get('state');
      if (!code) {
        return;
      }
      const authData = { code, error, state };
      if (window.opener) {
        window.opener.postMessage(authData, this.target);
        return false;
      }
      console.log('Missing window.opener. Going through localStorage');
      localStorage.setItem('tempOAuthResult', JSON.stringify(authData));
    }

    connectedCallback();
    receive();



  }

  //       // login success
  //
  //       let token = window.location.hash.split('&')[0].split('=')[1];
  //       // console.log('token' + token);
  // //  this.spotifyService.token = token;
  //       localStorage.setItem('spotify-token', token);
  //
  //   window.close();




}
