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

  getData() {
    return new Observable(fn => this._data.subscribe(fn));
  }

  updateData(user: SpotifyUser) {
    console.log('Updating User: ' + user.id);
    this._data.next(user);
  }
}
