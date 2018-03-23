import { Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, pipe} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {catchError} from 'rxjs/operators';
import {Album} from '../Album';
import {TrackSearchResults} from './models/track';
import {defer} from 'q';

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
  private redirect_url: string = 'http://localhost:5000/callback';
  // private redirect_uri: string = 'https://upnext-efec3.firebaseapp.com/callback';


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


   openDialog (uri, name, options, cb) {
    let win = window.open(uri, name, options);

    let interval = window.setInterval(function () {
      try {
        if (!win || win.closed) {
          window.clearInterval(interval);
          cb(win);
        }
      } catch (e) {}
    }, 1500);
    return win;
  }

   async authenticate(){
    let deffered = defer();
    let that = this;
    let params = {
      client_id: 'd4800b9ac98e4e09a15db22fc6a33f9f',
      // redirect_uri: 'https://upnext-efec3.firebaseapp.com/callback',
      redirect_uri: 'http://localhost:5000/callback',

      response_type: 'token'
    };

    let authCompleted: boolean = false;
    let scopes: string = 'playlist-modify-public playlist-modify-private user-read-currently-playing';
    let authWindow =  this.openDialog(
      'https://accounts.spotify.com/authorize?' + 'client_id='
      + encodeURIComponent(params.client_id) + '&redirect_uri=' +
      encodeURIComponent(params.redirect_uri) + '&response_type='
      + encodeURIComponent(params.response_type) + '&scope=' + encodeURIComponent(scopes),
      'Spotify',
      'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + 600 + ',height=' + 400 + ',top=' + 100 + ',left=' + 100,
       function () {
        if (!authCompleted) {
          deffered.reject('error deffered');
        }
        console.log('Auth Callback');
        console.log('token: ' + localStorage.getItem('spotify-token')); //TODO WED DIFOSDFJOIWEJ
        this.access_token =  localStorage.getItem('spotify-token');

      }
    );

    console.log('Access token: ' + this.access_token);
    //TODO do stuff with the token now
     function storageChanged(e) {
       if (e.key === 'spotify-token') {
         if(authWindow) {
           authWindow.close();
         }
         authCompleted = true;
         that.access_token = e.newValue;
         window.removeEventListener('storage',storageChanged, false);
         deffered.resolve(e.newValue);
       }
     }
     window.addEventListener('storage', storageChanged,false);
     return deffered.promise;
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
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
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
    return this.httpClient.get(this.albums_url, {headers: headers}).map(res => res
    ).catch(this.handleError);
  }


  unfollowPlaylist(user_id: string, playlist_id: string) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token);
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    this.album_url = this.url_base + 'users/' + user_id + '/playlists/' + playlist_id + '/followers';
    return this.httpClient.delete(this.album_url, {headers: headers}).catch(this.handleError);
  }

  getCurrentSong() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token);
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    this.track_url = this.url_base + 'me/player/currently-playing'; // TODO changed this
    return this.httpClient.get(this.track_url, {headers: headers}).map(res => res).catch(this.handleError);
  }

  addTracksToPlaylist(user_id: string, playlist_id: string, trackURIs: string[]) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token);
    headers = headers.append('Content-Type', 'application/json');

    this.track_url = this.url_base + 'users/' + user_id + '/playlists/' + playlist_id + '/tracks';
    return this.httpClient.post(this.track_url, {
      uris: trackURIs,
    }, {headers: headers}).pipe(catchError(this.handleError)).map(res => res).subscribe(data => console.log('Added Tracks\n' + data));
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
