import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {SpotifyService} from '../angular5-spotify';
import {Router} from '@angular/router';
import {SpotifyUser, User} from '../models/user.interface';
import {DataService} from '../data-service';
import {Observable} from 'rxjs/Observable';
import {Playlist, PlaylistSearchResults} from '../models/playlist';
import {UserPlaylistContainer} from '../models/user-playlist-container';

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
  private playlistToCreate: string = 'UpNextPlaylist'; //todo make this a shared variable with radio component to avoid redundancy

  constructor(private loginService: LoginService, private spotifyService: SpotifyService, private router: Router, private dataService: DataService) {

  }
  get diagnostic() { return JSON.stringify(this.user); }

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

    getUserInfo.toPromise().then((res: SpotifyUser) => {
            console.log('Res.User: ' + res);
            this.spotifyUser = res;
            this.dataService.updateUserID(res);
    },
      rej => console.log('Could Not Retrieve User Info')
    ).then(() => {
      playlistUpdate.toPromise().then((playlist) => {
        if (playlist === undefined) {
          //get current playlist

          this.spotifyService.getUserPlaylists().map(
            data => data.items as Playlist[]).filter(
              (res: Playlist[], index) => res[index].name === this.playlistToCreate).subscribe(
                (playlists: Playlist[]) => {
                  this.playlist = playlists['0'];
                  this.dataService.updatePlaylistID(playlists['0']);
                });
        } else {
          console.log('Res.Playlist: ' + playlist);
          this.playlist = playlist;
          this.dataService.updatePlaylistID(playlist);
        }
      },
        rej => console.log('Could Not Retrieve Playlist Info')
      );
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
