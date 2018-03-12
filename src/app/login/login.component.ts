import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {SpotifyService} from '../angular5-spotify';
import {Router} from '@angular/router';
import {SpotifyUser, User} from '../models/user.interface';
import {DataService} from '../data-service';
import {Observable} from 'rxjs/Observable';
import {Playlist, PlaylistSearchResults} from '../models/playlist';
import {UserPlaylistContainer} from '../models/user-playlist-container';
import {Track} from '../models/track';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  submitted = false;
  spotifyUser: SpotifyUser; //holds spotify id
  user: User;
  playlist: Playlist;
  private playlistToCreate: string = 'UpNextPlaylist';
  private dbTrackList: Track[];

  //todo make this a shared variable with radio component to avoid redundancy

  constructor(private loginService: LoginService, private spotifyService: SpotifyService, private router: Router, private dataService: DataService, private db: AngularFireDatabase) {

  }

  get diagnostic() {
    return JSON.stringify(this.user);
  }

  ngOnInit() {
    this.getUsername();
  }


  getUsername(): void {
    this.user = this.loginService.getUsername();
  }

  updateUser(user: SpotifyUser) {
    this.spotifyUser = user;
    this.dataService.updateUserID(user);
    return Promise.resolve(user.id);
  }

  async onSubmit() {
    this.submitted = true;
    this.user.loggedIn = true; // change later
    this.getUsername();
    // console.log(JSON.stringify(this.user));
    console.log('Authenticating');
    await this.spotifyService.authenticate();


    console.log('Requesting Tokens');
    console.log('Done Requesting Tokens');

    let playlistUpdate = this.containsPlaylist(this.playlistToCreate).filter(result => !result).switchMap(() =>
      this.spotifyService.createPlaylist(this.playlistToCreate, this.spotifyUser.id));
    //.map(playlist => Object.assign({}, this.playlist, { id: playlist.id }));

    let getUserInfo = this.spotifyService.getUserInfo();
    let getDBInfo = this.db.list<Track>('tracks').valueChanges().map(res => res);

    //Get User Info
    //Delete old playlist and create new playlist
    //Add tracks into playlist
    let that = this;

    //Get User ID
    await getUserInfo.toPromise().then((res: SpotifyUser) => {
        console.log('Login: GetUser: ' + res.id);
        this.spotifyUser = res;
        this.dataService.updateUserID(res);
      },
      rej => console.log('Could Not Retrieve User Info')
    ).then(() => {
      //Determine whether playlist exists or not
      return playlistUpdate.toPromise().then((playlist) => {
          if (playlist === undefined) {
            //If the playlist exists, get it
            return this.spotifyService.getUserPlaylists().map(
              data => data.items as Playlist[]).filter(
              (res: Playlist[], index) => res[index].name === this.playlistToCreate).toPromise().then(
              (playlists: Playlist[]) => {
                this.playlist = playlists['0'];
                console.log(playlists['0']);
              }).then(() => {
              return this.spotifyService.unfollowPlaylist(this.spotifyUser.id, this.playlist.id).toPromise().then(() => {
                console.log('Unfollowing Playlist');
              }).then(() => {
                return this.spotifyService.createPlaylist(this.playlistToCreate, this.spotifyUser.id).toPromise().then((data: Playlist) => {
                  this.playlist = data;
                  this.dataService.updatePlaylistID(data);
                  console.log('New Playlist: ' + data.id);
                  return data;
                });
              });
            });
          } else {
            console.log('Res.Playlist: ' + playlist);
            this.playlist = playlist;
            this.dataService.updatePlaylistID(playlist);
            return playlist;
          }
        },
        rej => {
          console.log('rejected: ' + rej);
        }
      );
    }).then(res => {
      console.log('Populate Playlist: \n' + typeof res + ': ' + res.id);
      return this.db.list<Track>('tracks').valueChanges().subscribe((data: Track[]) => {
        let trackArray: Array<string> = [];
        data.forEach(f => trackArray.push('spotify:track:' + f.id));
        console.log(trackArray);
        return this.spotifyService.addTracksToPlaylist(this.spotifyUser.id, res.id, trackArray);
      });
    });
    this.router.navigate(['/home']);


  }

  containsPlaylist(playlistToCreate: string): Observable<boolean> {
    return this.spotifyService.getUserPlaylists().map(data => data.items).map(arrayOfTracks =>
      arrayOfTracks.some(track => track.name === playlistToCreate));
  }


}
