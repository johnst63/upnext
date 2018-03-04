import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {SpotifyService} from '../angular5-spotify';
import {Router} from '@angular/router';
import {SpotifyUser, User} from '../models/user.interface';
import {DataService} from '../data-service';
import {Observable} from 'rxjs/Observable';
import {Playlist} from '../models/playlist';
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
    //.map((data: SpotifyUser)  => Object.assign({}, this.spotifyUser, { id: data.id}));

    Observable.merge(getUserInfo, playlistUpdate).subscribe(
      (res) => {
        console.log('DATA');
        console.log(res);
        if (res.followers) {
          this.spotifyUser = res;
          this.dataService.updateUserID(res.spotifyUser);
        } else {
          let playlist = res.next().playlist;
          console.log(playlist);
          this.playlist = playlist;
          this.dataService.updatePlaylistID(playlist);
        }
        // this.dataService.updateUserID(res.spotifyUser);
        // this.dataService.updatePlaylistID(res.playlist);
      });
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
