import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SpotifyUser} from './models/user.interface';
import {Observable} from 'rxjs/Observable';

export class DataService {
  private defaultUser: SpotifyUser = {
    id: 'unidentified_user'
  };

  private _data: BehaviorSubject<SpotifyUser> = new BehaviorSubject(this.defaultUser);
  public readonly data: Observable<SpotifyUser> = this._data.asObservable();

  getUserID() {
    return new Observable(fn => this._data.subscribe(fn));
  }

  updateUserID(user: SpotifyUser) {
    console.log('Updating User: ' + user.id);
    this._data.next(user);
  }

  // private playlist_id = 'undefined playlist id';
  // private _pl_data: BehaviorSubject<string> = new BehaviorSubject<string>(this.playlist_id);
  // getPlaylistID() {
  //   return new Observable(fn => this._data.subscribe(fn));
  // }
  //
  // updatePlaylistID(playlist_id: string) {
  //   this._pl_data.next(playlist_id);
  // }


}
