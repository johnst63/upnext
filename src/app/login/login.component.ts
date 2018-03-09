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

  constructor(private loginService: LoginService, private spotifyService: SpotifyService, private router: Router,
              private dataService: DataService) {

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

  async onSubmit() {
    this.submitted = true;
    this.user.loggedIn = true; // change later
    this.getUsername();
    // console.log(JSON.stringify(this.user));
    console.log('Authenticating');
    await this.spotifyService.authenticate();
    this.router.navigate(['/home']);


    console.log('Requesting Tokens');
    console.log('Done Requesting Tokens');
    // this.router.navigate(['/home']);

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

    // playlistUpdate.subscribe(
    //   (data: Playlist) => { console.log('Updating Playlist ID'); this.dataService.updatePlaylistID(data); });

  }

  containsPlaylist(playlistToCreate: string): Observable<boolean> {
    return this.spotifyService.getUserPlaylists().map(data => data.items).map(arrayOfTracks =>
      arrayOfTracks.some(track => track.name === playlistToCreate));
  }


}
