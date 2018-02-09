import {Injectable, Inject, Optional} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

export interface SpotifyConfig {
  clientId: string ;
  redirectUri: string;
  scope: string;
  authToken?: string;
  apiBase: string;
}

export interface SpotifyOptions {
  limit?: number;
  offset?: number;
  market?: string;
  album_type?: string;
  country?: string;
  type?: string;
  q?: string;
  timestamp?: string;
  locale?: string;
  public?: boolean;
  name?: string;
  time_range?: string;
  after?: string;
  before?: string;
}

interface HttpRequestOptions {
  method?: string;
  url: string;
  search?: Object;
  body?: Object;
  headers?: Headers;
}

@Injectable()
export class SpotifyService {
  constructor( @Inject('SpotifyConfig') private config: SpotifyConfig, private http: HttpClient) {
    config.apiBase = 'https://api.spotify.com/v1';
  }

  //#region albums

  /**
   * Gets an album
   * Pass in album id or spotify uri
   */
  getAlbum(album: string) {
    album = this.getIdFromUri(album);
    return this.api({
      method: 'get',
      url: `/albums/${album}`
    }).mapTo(res => res.json());
  }

  /**
   * Gets albums
   * Pass in comma separated string or array of album ids
   */
  getAlbums(albums: string | Array<string>) {
    const albumList = this.mountItemList(albums);
    return this.api({
      method: 'get',
      url: `/albums`,
      search: { ids: albumList.toString() }
    }).mapTo(res => res.json());
  }

  /**
   * Get Album Tracks
   * Pass in album id or spotify uri
   */
  getAlbumTracks(album: string, options?: SpotifyOptions) {
    album = this.getIdFromUri(album);
    return this.api({
      method: 'get',
      url: `/albums/${album}/tracks`,
      search: options
    }).mapTo(res => res.json());
  }

  //#endregion

  //#region artists

  /**
   * Get an Artist
   */
  getArtist(artist: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}`
    }).mapTo(res => res.json());
  }

  /**
   * Get multiple artists
   */
  getArtists(artists: string | Array<string>) {
    const artistList = this.mountItemList(artists);
    return this.api({
      method: 'get',
      url: `/artists/`,
      search: { ids: artists.toString() }
    }).mapTo(res => res.json());
  }




  //#endregion

  //#region browse

  getFeaturedPlaylists(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/featured-playlists`,
      search: options,
      headers: this.getHeaders()
    }).mapTo(res => res.json());
  }


  getCategories(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories`,
      search: options,
      headers: this.getHeaders()
    }).mapTo(res => res.json());
  }

  getCategory(categoryId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories/${categoryId}`,
      search: options,
      headers: this.getHeaders()
    }).mapTo(res => res.json());
  }

  getCategoryPlaylists(categoryId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories/${categoryId}/playlists`,
      search: options,
      headers: this.getHeaders()
    }).mapTo(res => res.json());
  }







  userFollowingContains(type: string, ids: string | Array<string>) {
    return this.api({
      method: 'get',
      url: `/me/following/contains`,
      search: { type: type, ids: ids.toString() },
      headers: this.getHeaders()
    }).mapTo(res => res.json());
  }

  followPlaylist(userId: string, playlistId: string, isPublic?: boolean) {
    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}/followers`,
      body: { public: !!isPublic },
      headers: this.getHeaders(true)
    });
  }

  unfollowPlaylist(userId: string, playlistId: string) {
    return this.api({
      method: 'delete',
      url: `/users/${userId}/playlists/${playlistId}/followers`,
      headers: this.getHeaders()
    });
  }

  playlistFollowingContains(userId: string, playlistId: string, ids: string | Array<string>) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists/${playlistId}/followers/contains`,
      search: { ids: ids.toString() },
      headers: this.getHeaders()
    }).mapTo(res => res.json());
  }


  //#endregion

  //#region library

  getSavedUserTracks(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/me/tracks`,
      headers: this.getHeaders(),
      search: options
    }).mapTo(res => res.json());
  }

  userTracksContains(tracks: string | Array<string>) {
    const trackList = this.mountItemList(tracks);
    return this.api({
      method: 'get',
      url: `/me/tracks/contains`,
      headers: this.getHeaders(),
      search: { ids: trackList.toString() }
    }).mapTo(res => res.json());
  }

  saveUserTracks(tracks: string | Array<string>) {
    const trackList = this.mountItemList(tracks);

    return this.api({
      method: 'put',
      url: `/me/tracks`,
      headers: this.getHeaders(),
      search: { ids: trackList.toString() }
    });
  }

  removeUserTracks(tracks: string | Array<string>) {
    const trackList = this.mountItemList(tracks);

    return this.api({
      method: 'delete',
      url: `/me/tracks`,
      headers: this.getHeaders(),
      search: { ids: trackList.toString() }
    });
  }

  getSavedUserAlbums(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/me/albums`,
      headers: this.getHeaders(),
      search: options
    }).mapTo(res => res.json());
  }




  //#endregion

  //#region personalization


  getUserRecentlyPlayed(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/me/player/recently-played`,
      search: options,
      headers: this.getHeaders()
    }).mapTo(res => res.json());
  }

  //#endregion

  //#region playlists

  getUserPlaylists(userId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists`,
      headers: this.getHeaders(),
      search: options
    }).mapTo(res => res.json());
  }


  getPlaylist(userId: string, playlistId: string, options?: { fields: string }) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists/${playlistId}`,
      headers: this.getHeaders(),
      search: options
    }).mapTo(res => res.json());
  }

  getPlaylistTracks(userId: string, playlistId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(),
      search: options
    }).mapTo(res => res.json());
  }

  createPlaylist(userId: string, options: { name: string, public?: boolean }) {
    return this.api({
      method: 'post',
      url: `/users/${userId}/playlists`,
      headers: this.getHeaders(true),
      body: options
    }).mapTo(res => res.json());
  }

  addPlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>, options?: { position: number }) {
    const trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
    trackList.forEach((value, index) => {
      trackList[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
    });

    const search = { uris: trackList.toString() };
    if (!!options) { search['position'] = options.position; }

    return this.api({
      method: 'post',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(true),
      search: search
    }).mapTo(res => res.json());
  }

  removePlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>) {
    const trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
    const trackUris = [];
    trackList.forEach((value, index) => {
      trackUris[index] = {
        uri: value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value
      };
    });
    return this.api({
      method: 'delete',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(true),
      body: { tracks: trackUris }
    }).mapTo(res => res.json());
  }

  reorderPlaylistTracks(userId: string, playlistId: string, options: { range_start: number, range_length?: number, insert_before: number, snapshot_id?: string }) {
    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(true),
      body: options
    }).mapTo(res => res.json());
  }

  replacePlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>) {
    const trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
    trackList.forEach((value, index) => {
      trackList[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
    });

    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(),
      search: { uris: trackList.toString() }
    }).mapTo(res => res.json());
  }

  updatePlaylistDetails(userId: string, playlistId: string, options: Object) {
    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}`,
      headers: this.getHeaders(true),
      body: options
    });
  }

  //#endregion

  //#region profiles

  getUser(userId: string) {
    return this.api({
      method: 'get',
      url: `/users/${userId}`
    }).mapTo(res => res.json());
  }

  getCurrentUser() {
    return this.api({
      method: 'get',
      url: `/me`,
      headers: this.getHeaders()
    }).mapTo(res => res.json());
  }

  //#endregion

  //#region search

  /**
   * Search Spotify
   * q = search query
   * type = artist, album or track
   */
  search(q: string, type: string, options?: SpotifyOptions) {
    options = options || {};
    options.q = q;
    options.type = type;

    return this.api({
      method: 'get',
      url: `/search`,
      search: options
    }).mapTo(res => res.json());
  }

  //#endregion

  //#region tracks

  getTrack(track: string) {
    track = this.getIdFromUri(track);
    return this.api({
      method: 'get',
      url: `/tracks/${track}`
    }).mapTo(res => res.json());
  }

  getTracks(tracks: string | Array<string>) {
    const trackList = this.mountItemList(tracks);
    return this.api({
      method: 'get',
      url: `/tracks/`,
      search: { ids: trackList.toString() }
    }).mapTo(res => res.json());
  }



  //#endregion

  //#region login

  login() {
    const promise = new Promise((resolve, reject) => {
      const w = 400,
        h = 500,
        left = (screen.width / 2) - (w / 2),
        top = (screen.height / 2) - (h / 2);

      const params = {
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        scope: this.config.scope || '',
        response_type: 'token'
      };
      let authCompleted = false;
      const authWindow = this.openDialog(
        'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
        'Spotify',
        'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left,
        () => {
          if (!authCompleted) {
            return reject('Login rejected error');
          }
        }
      );

      const storageChanged = (e) => {
        if (e.key === 'angular2-spotify-token') {
          if (authWindow) {
            authWindow.close();
          }
          authCompleted = true;

          this.config.authToken = e.newValue;
          window.removeEventListener('storage', storageChanged, false);

          return resolve(e.newValue);
        }
      };
      window.addEventListener('storage', storageChanged, false);
    });

    return Observable.fromPromise(promise).catch(this.handleError);
  }

  //#endregion

  //#region utils

  private toQueryString(obj: Object): string {
    const parts = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    }
    return parts.join('&');
  }

  private openDialog(uri, name, options, cb) {
    const win = window.open(uri, name, options);
    const interval = window.setInterval(() => {
      try {
        if (!win || win.closed) {
          window.clearInterval(interval);
          cb(win);
        }
      } catch (e) { }
    }, 1000000);
    return win;
  }

  private auth(isJson?: boolean): Object {
    const auth = {
      'Authorization': 'Bearer ' + this.config.authToken
    };
    if (isJson) {
      auth['Content-Type'] = 'application/json';
    }
    return auth;
  }

  private getHeaders(isJson?: boolean): any {
    return new Headers(this.auth(isJson));
  }

  private getIdFromUri(uri: string) {
    return uri.indexOf('spotify:') === -1 ? uri : uri.split(':')[2];
  }

  private mountItemList(items: string | Array<string>): Array<string> {
    const itemList = Array.isArray(items) ? items : items.split(',');
    itemList.forEach((value, index) => {
      itemList[index] = this.getIdFromUri(value);
    });
    return itemList;
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json() || 'Server error'); //was .json().error
  }

  private api(requestOptions: HttpRequestOptions) {
    return this.http.request(new HttpRequest(requestOptions.method || 'get',
      this.config.apiBase + requestOptions.url, this.toQueryString(requestOptions.search)));


    // return this.http.request(new Request({
    //   url: this.config.apiBase + requestOptions.url,
    //   method: requestOptions.method || 'get',
    //   search: this.toQueryString(requestOptions.search),
    //   body: JSON.stringify(requestOptions.body),
    //   headers: requestOptions.headers
    // }));
  }

  //#endregion

}
