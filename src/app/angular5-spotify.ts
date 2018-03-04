import { Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, pipe} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {catchError} from 'rxjs/operators';
import {Album} from '../Album';
import {TrackSearchResults} from './models/track';
import * as Q from 'q';

// export interface SpotifyConfig {
//   clientId: string ;
//   redirectUri: string;
//   scope: string;
//   authToken?: string;
//   apiBase: string;
// }
//
// interface HttpRequestOptions {
//   method?: string;
//   url: string;
//   search?: Object;
//   body?: Object;
//   headers?: Headers;
// }
function ensureOk(response) {
  return response.ok ? Promise.resolve(response) : Promise.reject(new Error('Received Bad Status Code'));
}

@Injectable()
export class SpotifyService {
  private url_base = 'https://api.spotify.com/v1/';
  private search_url: string;
  private artist_url: string;
  private albums_url: string;
  private album_url: string;
  private user_url: string;
  private track_url: string;
  private auth_url: string = 'https://accounts.spotify.com/authorize';
  private token_url: string = 'https://accounts.spotify.com/api/token/';
  private redirect_url: string = 'http://localhost:4200/callback';

  private client_id = 'd4800b9ac98e4e09a15db22fc6a33f9f';
  private secret_key = 'c1988f4fc8f347918e0ac41b7409163b';
  private access_token: string;
  album: Album;
  constructor(private httpClient: HttpClient) {
  }

  searchArtist(artistName: string) {
    //let headers is not an error, lint problem
    let headers = new HttpHeaders().set('Authorization', 'Bearer' + this.client_id);

    this.search_url = this.url_base + 'search?q=' + artistName + '&type=artist&market=US&limit=20&offset=0';
    return this.httpClient.get(this.search_url, {headers: headers}).map(res => res).catch(this.handleError);
  }

  getArtist(artistID: string) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer' + this.client_id);

    this.artist_url = this.url_base + 'artists/' + artistID;
    return this.httpClient.get(this.artist_url, {headers: headers}).map(res => res).catch(this.handleError);

  }


    openDialog (uri, name, options, cb): Window {
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


  authenticate() {
    return new Promise((res, rej) => {
      const params = {
          client_id: 'd4800b9ac98e4e09a15db22fc6a33f9f',
          redirect_uri: 'http://localhost:4200/callback',
          response_type: 'token'
      };
      let scopes: string = 'playlist-modify-public user-read-currently-playing';
      let window_uri = 'https://accounts.spotify.com/authorize?' + 'client_id='
        + encodeURIComponent(params.client_id) + '&redirect_uri='
        + encodeURIComponent(params.redirect_uri) + '&response_type='
        + encodeURIComponent(params.response_type) + '&scope=' + encodeURIComponent(scopes);
      let name = 'Spotify';
      let options = 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width='
        + 600 + ',height=' + 400 + ',top=' + 100 + ',left=' + 100;
      function cb() {
        console.log('Callback!');
        return;
      }
      let win = this.openDialog(window_uri, name, options, cb);
      if (!win) {
        return rej(new Error('Null Window Handle'));
      }

      const handleFunction = (/** @type MessageEvent */ev) => {
        console.log('Handling:');
        // if (ev.origin !== 'http://localhost') {
        //   console.warn(`Received message from invalid domain ${ev.origin}.`);
        //   return;
        // }

        win.close();

        if (!ev.data) {
          return rej(new Error('Received No Data with Auth Message.\n' + console.log(ev)));
        }
        if (ev.data.error) {
          return rej(new Error(ev.data.error));
        }
        console.log(ev);
        return res(ev.data.code);
      };

      win.addEventListener('message', handleFunction);
    }).then(response => {console.log('ensuring ok'); return ensureOk(response); })
      .then(response => response.json())
      .then(response => {
        this.access_token = response.access_token;
        localStorage.setItem('spotify-token', response.access_token);
        console.log('Access Token: ' + this.access_token);
      });
    // let params = {
    //   client_id: 'd4800b9ac98e4e09a15db22fc6a33f9f',
    //   redirect_uri: 'http://localhost:4200/callback',
    //   response_type: 'token'
    // };
    //
    // let authCompleted: boolean = false;
    // let scopes: string = 'playlist-modify-public user-read-currently-playing';
    // let authWindow = this.openDialog(
    //   'https://accounts.spotify.com/authorize?' + 'client_id='
    //   + encodeURIComponent(params.client_id) + '&redirect_uri=' +
    //   encodeURIComponent(params.redirect_uri) + '&response_type='
    //   + encodeURIComponent(params.response_type) + '&scope=' + encodeURIComponent(scopes),
    //   'Spotify',
    //   'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + 600 + ',height=' + 400 + ',top=' + 100 + ',left=' + 100,
    //   function () {
    //
    //     console.log('Auth Callback');
    //     console.log('token: ' + localStorage.getItem('spotify-token')); //TODO WED DIFOSDFJOIWEJ
    //   }
    // );
    // // this.access_token = localStorage.getItem('spotify-token');
    // console.log('Access token: ' + this.access_token);
    // this.access_token = localStorage.getItem('spotify-token');

    //TODO do stuff with the token now

  }

  getTrack(trackId: string) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    this.track_url = this.url_base + 'tracks/' + trackId;
    return this.httpClient.get(this.track_url, {headers: headers}).map(res => res).catch(this.handleError);
  }

  getTracks(trackIds: string[]) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    this.track_url = this.url_base + 'tracks?ids=' + trackIds.join(',');
    return this.httpClient.get(this.track_url, {headers: headers}).map(res => res).catch(this.handleError);
  }

  searchForTrack(keyword: string) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    let params = new HttpParams().set('q', keyword);
    params = params.append('type', 'track');

    this.track_url = this.url_base + 'search';
    return this.httpClient.get(this.track_url, {params: params, headers: headers}).map(res => res).catch(this.handleError);
  }

  getUserPlaylists() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token);
    this.album_url = this.url_base + 'me/playlists';
    return this.httpClient.get(this.album_url, {headers: headers}).map(res => res).catch(this.handleError);
  }

  createPlaylist(name: string, user_id: string) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token)
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    let params = new HttpParams().set('name', name);

    this.albums_url = this.url_base + 'users/' + user_id + '/playlists';
    return this.httpClient.post(this.albums_url, {
      name: name
    }, {headers: headers}).map(res => res).catch(this.handleError);
  }

  getPlaylist(user_id: string, playlist_id: string) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token);

    this.albums_url = this.url_base + 'users/' + user_id + '/playlists/' + playlist_id;
    return this.httpClient.get(this.albums_url, {headers: headers}).map(res => res).catch(this.handleError);
  }

  addTracksToPlaylist(user_id: string, playlist_id: string, trackURIs: string[]) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token);
    headers = headers.append('Content-Type', 'application/json');

    this.track_url = this.url_base + 'users/' + user_id + '/playlists/' + playlist_id + '/tracks';
    return this.httpClient.post(this.track_url, {
      uris: trackURIs,
    }, {headers: headers}).pipe(catchError(this.handleError)).subscribe(data => console.log(data));
  }

  getUserInfo() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token);
    this.user_url = this.url_base + 'me';

    return this.httpClient.get(this.user_url, {headers: headers}).map(res => res).catch(this.handleError);
  }


  getAlbum(id: string){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token )
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
      //.append('id', id);

    this.albums_url = 'https://api.spotify.com/v1/albums/' + id ;
    //let params = new HttpParams().set('id', id);
    return this.httpClient.get(this.albums_url, {headers: headers}, )
      .subscribe(res => res);
  }

  requestTokens(auth_key: any) {
    let params = new HttpParams().set('grant_type', 'authorization_code');
    params = params.append('code', 'Unknown');
    params = params.append('redirect_uri', this.redirect_url + '/login');

    // let headers = new HttpHeaders().set('Authorization', 'Bearer' + this.client_id);
    let headers = new HttpHeaders().set('Authorization', 'Basic' + this.client_id + ':' + this.secret_key);
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient.post(this.token_url, {
      grant_type: 'authorization_code',
      code: auth_key,
      redirect_uri: 'http://localhost:4200/login'
    }, {headers: headers}).pipe(catchError(this.handleError)).subscribe();
  }



  // createPlaylistIfDoesNotExist(playlistToCreate: string, spotifyUserID: string) {
  //   let playlistSearchResults: TrackSearchResults;
  //   let alreadyExists: boolean = false;
  //     this.getUserPlaylists().subscribe(data => {
  //     playlistSearchResults = data;
  //     playlistSearchResults.items.forEach(f => {
  //         if (f.name === playlistToCreate) {
  //           alreadyExists = true;
  //           // this.playlist_id = f.id;
  //         }
  //       }
  //     );
  //   });
  //   if (!alreadyExists) {
  //     this.createPlaylist(playlistToCreate, spotifyUserID).subscribe(
  //       data => {
  //         // this.playlist_id = data.id;
  //         console.log('Successfully Created Playlist!');
  //       },
  //       error => console.log(error));
  //   }
  // }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof Error) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status} with message: ${error.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }

}
