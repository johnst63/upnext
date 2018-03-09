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

  onSubmit() {
    this.submitted = true;
    this.user.loggedIn = true; // change later
    this.getUsername();
    // console.log(JSON.stringify(this.user));
    console.log('Authenticating');
    this.spotifyService.authenticate();


    console.log('Requesting Tokens');
    console.log('Done Requesting Tokens');
    this.router.navigate(['/home']);

    let playlistUpdate = this.containsPlaylist(this.playlistToCreate).filter(result => !result).switchMap(() =>
      this.spotifyService.createPlaylist(this.playlistToCreate, this.spotifyUser.id));
    //.map(playlist => Object.assign({}, this.playlist, { id: playlist.id }));

    let getUserInfo = this.spotifyService.getUserInfo();
    let getDBInfo = this.db.list<Track>('tracks').valueChanges();

    //Get User ID
    getUserInfo.toPromise().then((res: SpotifyUser) => {
        console.log('Login: GetUser: ' + res);
        this.spotifyUser = res;
        this.dataService.updateUserID(res);
      },
      rej => console.log('Could Not Retrieve User Info')
    ).then(() => {
      //Determine whether playlist exists or not
      playlistUpdate.toPromise().then((playlist) => {
          if (playlist === undefined) {
            //If the playlist exists, get it
            this.spotifyService.getUserPlaylists().map(
              data => data.items as Playlist[]).filter(
              (res: Playlist[], index) => res[index].name === this.playlistToCreate).toPromise().then(
              (playlists: Playlist[]) => {
                this.playlist = playlists['0'];
                console.log(playlists['0']);
              }).then(() => {
              this.spotifyService.unfollowPlaylist(this.spotifyUser.id, this.playlist.id).toPromise().then(() => {
                console.log('Unfollowing Playlist');
              }).then(() => {
                this.spotifyService.createPlaylist(this.playlistToCreate, this.spotifyUser.id).toPromise().then((data: Playlist) => {
                  this.playlist = data;
                  this.dataService.updatePlaylistID(data);
                  console.log('New Playlist: ' + data);
                });
              });
            });
          } else {
            console.log('Res.Playlist: ' + playlist);
            this.playlist = playlist;
            this.dataService.updatePlaylistID(playlist);
          }
        },
        rej => console.log('Could Not Retrieve Playlist Info')
      );
    }).then(() => {
      console.log('Populate Playlist');
      let dbTrackList: Track[] = [];
      getDBInfo.toPromise().then((data: Track[]) => {
        dbTrackList = data;
      });
      return dbTrackList;
    }).then(dbTrackList => {
      let trackArray: Array<string> = [];
      dbTrackList.forEach(f => trackArray.push(f.id));
      this.spotifyService.addTracksToPlaylist(this.spotifyUser.id, this.playlist.id, trackArray);
    });
    //.map((data: SpotifyUser)  => Object.assign({}, this.spotifyUser, { id: data.id}));

    // Observable.merge(getUserInfo.mapTo(this.spotifyUser), playlistUpdate.mapTo(this.playlist)).take(2).subscribe(
    //   (res) => {
    //     if (typeof(res) === typeof(this.playlist)) {
    //       console.log(typeof(res));
    //       console.log(typeof(this.playlist));
    //       console.log('Res.Playlist: ' + res);
    //
    //       this.playlist = res;
    //       this.dataService.updatePlaylistID(res);
    //     } else if (typeof(res) === typeof(this.spotifyUser)) {
    //       console.log('Res.User: ' + res);
    //
    //       this.spotifyUser = res;
    //       this.dataService.updateUserID(res);
    //     }
    //     // console.log('DATA>NEXT: \n' + res.next());
    //     // this.dataService.updateUserID(res.spotifyUser);
    //   },
    //   err => console.log('Error: ' + err),
    // );


    // this.spotifyService.getUserInfo().subscribe((data: SpotifyUser) => {
    //   this.spotifyUser = data,
    //   this.dataService.updateUserID(this.spotifyUser);
    // });
    //now need to get playlists and if the name does not already exist create a playlist and populate it with songs from database

    // playlistUpdate.subscribe(
    //   (data: Playlist) => { console.log('Updating Playlist ID'); this.dataService.updatePlaylistID(data); });

  }

  containsPlaylist(playlistToCreate: string): Observable<boolean> {
    return this.spotifyService.getUserPlaylists().map(data => data.items).map(arrayOfTracks =>
      arrayOfTracks.some(track => track.name === playlistToCreate));
  }
}
