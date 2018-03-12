import {Component, OnInit} from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {ActivatedRoute} from '@angular/router';
import {Album} from '../../Album';
import {Track, Tracks, TrackSearchResults} from '../models/track';
import {AngularFireDatabase} from 'angularfire2/database';
import {DataService} from '../data-service';
import {SpotifyUser} from '../models/user.interface';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Playlist} from '../../Playlist';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  title = 'UpNext';
  track: Track;
  trackList: Tracks;
  tracks_string: any[];
  tracks: any;
  dbTrackList: Array<Track>;
  private spotifyUser: SpotifyUser;
  dangerousPlaylistURL: string;
  playlistURL: SafeResourceUrl;
  private playlist: Playlist;
  private currentSong: Track;

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private db: AngularFireDatabase, private dataService: DataService) {

  }

  ngOnInit() {
    this.db.list<Track>('tracks').valueChanges().subscribe((data: Track[]) => {
      this.dbTrackList = data;
      console.log(data);
    });
    this.dataService.getUserID().subscribe(
      (data: SpotifyUser) => {
        console.log('Updating Spotify User (HomeComponent)\n' + data.id);
        this.spotifyUser = data; //gets user_id
        this.updatePlaylistURL();
      },
      error => console.log(error),
    );
    // this.spotifyService.getPlaylist(this.spotifyUser.id, '');
    this.spotifyService.getCurrentSong().subscribe(
      (data) => { console.log('Current Track: ' + data['item'].name); this.currentSong = data['item'];
    },
        err => console.log('Waiting on valid user id')
    );

  }

  updatePlaylistURL() {
    this.dataService.getPlaylistID().subscribe((playlist: Playlist) => {
      if (playlist.id !== 'unassigned_playlist') {
        this.dangerousPlaylistURL = 'https://open.spotify.com/embed?uri=spotify:user:' + this.spotifyUser.id + ':playlist:' + playlist.id + '&view=coverart';
        this.playlistURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousPlaylistURL);
        console.log('Updated:' + this.dangerousPlaylistURL);
      }
    });

  }
}


