import { Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

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
  private token_url: string = 'https://accounts.spotify.com/api/token';

  private client_id = 'd4800b9ac98e4e09a15db22fc6a33f9f';
  private secret_key = 'c1988f4fc8f347918e0ac41b7409163b';


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

  getTrack(trackId: string) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer' + this.client_id);

    this.track_url = this.url_base + 'tracks/' + trackId;
    return this.httpClient.get(this.track_url, {headers: headers}).map(res => res).catch(this.handleError);
  }

  authenticate() {
    let headers = new HttpHeaders().set('client_id', this.client_id);
    headers.set('response_type', 'token');
    headers.set('redirect_uri', 'http://localhost:4200/');
    headers.set('Content-Type', 'application/x-www-form-urlencoded');


    return this.httpClient.get(this.auth_url, {headers: headers}).map(res => res).catch(this.handleError);
  }

  requestTokens() {
    let headers = new HttpHeaders().set('grant_type', 'authorization_code');
    headers.set('code', 'Unknown');
    headers.set('redirect_uri', 'http://localhost:4200/');
    headers.set('Content-Type', 'html');

    return this.httpClient.post(this.token_url, {headers: headers}).subscribe(res => res);
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
