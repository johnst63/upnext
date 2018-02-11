import { Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {catchError} from 'rxjs/operators';
import {Album} from '../Album';

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
  private track_url: string;
  private auth_url: string = 'https://accounts.spotify.com/authorize';
  private token_url: string = 'https://accounts.spotify.com/api/token/';
  private redirect_url: string = 'http://localhost:4200';

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
    }, 1000);
    return win;
  }
  authenticate() {
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
        console.log('token: bitches!    ' + localStorage.getItem('spotify-token')); //TODO WED DIFOSDFJOIWEJ


      }
    );
    this.access_token = localStorage.getItem('spotify-token');
    console.log('Access token: ' + this.access_token);
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
