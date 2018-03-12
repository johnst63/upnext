import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SpotifyUser} from './models/user.interface';
import {Observable} from 'rxjs/Observable';
import {Playlist} from './models/playlist';
import {Track} from './models/track';

export class DataService {
  private defaultUser: SpotifyUser = {
    id: 'unidentified_user'
  };

  private defaultPlaylist: Playlist = {
    id: 'unassigned_playlist',
    name: 'unassigned_playlist'
  };


  // Playlist Info
  private _pl_data: BehaviorSubject<Playlist> = new BehaviorSubject<Playlist>(this.defaultPlaylist);

  //User Info
  private _data: BehaviorSubject<SpotifyUser> = new BehaviorSubject(this.defaultUser);
  public readonly data: Observable<SpotifyUser> = this._data.asObservable();


  getUserID() {
    return new Observable(fn => this._data.subscribe(fn));
  }

  updateUserID(user: SpotifyUser) {
    //console.log('Updating User: ' + user.id + ' (DataService)');
    this._data.next(user);
  }

  getPlaylistID() {
    return new Observable(fn => this._pl_data.subscribe(fn));
  }

  updatePlaylistID(playlist: Playlist) {
    console.log('Updating Playlist: ' + playlist.id + ', ' + playlist.name);
    this._pl_data.next(playlist);
  }

}
