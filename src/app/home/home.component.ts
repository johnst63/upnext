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
  private tracklistTracks: Track[];
  private tracklistKeys: string[];
  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private db: AngularFireDatabase, private dataService: DataService) {

  }

  ngOnInit() {
    // this.db.list<Track>('tracks').valueChanges().subscribe((data: Track[]) => {
    //   this.dbTrackList = data;
    //   console.log(data);
    // });


    this.db.list<Track>('tracks').snapshotChanges().map(actions => {
      return actions.map(action => ({key: action.key, value: action.payload.val()}));
    }).subscribe(items => {
      this.tracklistKeys = items.map(item => item.key);
      this.tracklistTracks = items.map(item => item.value);
      // let trackArray: Array<string> = [];
      // this.tracklistTracks.forEach(f => trackArray.push('spotify:track:' + f.id));
      // console.log(items.map(item => ({key: item.key, value: item.value})));
      // console.log(trackArray);
      // this.dataService.updateTracks(items.map(item => ({key: item.key, value: item.value})));
      // this.dataService.getPlaylistID().subscribe((playlist: Playlist) => {
      //   this.spotifyService.addTracksToPlaylist(this.spotifyUser.id, playlist.id, trackArray);
      // });
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

  upvote(track: Track) {
    if (this.spotifyUser.id === 'unidentified_user') {
      return;
    }
    console.log(this.tracklistKeys);
    let values = this.tracklistTracks;
    let index = -1;
    for (let i = 0; i < this.tracklistTracks.length; i++) {
      if (values[i].id === track.id) {
        index = i;
      }
    }
    if (index === -1) {
      return;
    }
    track.votes += 1;
    this.db.list('tracks').update(this.tracklistKeys[index], ({ votes: track.votes }));
    console.log('upvote');
    return;
  }

  downvote(track: Track) {
    if (this.spotifyUser.id === 'unidentified_user') {
      return;
    }
    console.log(this.tracklistKeys);
    let values = this.tracklistTracks;
    let index = -1;
    for (let i = 0; i < this.tracklistTracks.length; i++) {
      if (values[i].id === track.id) {
        index = i;
      }
    }
    if (index === -1) {
      return;
    }
    if (track.votes > Number.MIN_SAFE_INTEGER && track.votes < Number.MAX_SAFE_INTEGER) {
      track.votes -= 1;
    }
    this.db.list('tracks').update(this.tracklistKeys[index], ({ votes: track.votes }));
    console.log('upvote');
    return;
  }
}


