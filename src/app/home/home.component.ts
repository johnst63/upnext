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
  tracks: any;
  private spotifyUser: SpotifyUser;
  dangerousPlaylistURL: string;
  playlistURL: SafeResourceUrl;
  private currentSong: Track;
  private tracklistTracks: Track[];
  private tracklistKeys: string[];
  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private db: AngularFireDatabase, private dataService: DataService) {

  }

  ngOnInit() {
    this.db.list<Track>('tracks').snapshotChanges().map(actions => {
      return actions.map(action => ({key: action.key, value: action.payload.val()}));
    }).subscribe(items => {
      this.tracklistKeys = [];
      this.tracklistTracks = [];
      items.sort((a, b) => {
        return a.value.votes < b.value.votes ? 1 : -1;
      }).map(item => {
        this.tracklistTracks.push(item.value);
        this.tracklistKeys.push(item.key);
      });
      this.tracklistTracks.map(v => console.log(v.name + ': ' + v.votes));
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
      (data) => { this.currentSong = data['item'];
    },
        err => console.log('Waiting on valid user id')
    );

  }

  updatePlaylistURL() {
    this.dataService.getPlaylistID().subscribe((playlist: Playlist) => {
      if (playlist.id !== 'unassigned_playlist') {
        this.dangerousPlaylistURL = 'https://open.spotify.com/embed?uri=spotify:user:' + this.spotifyUser.id + ':playlist:' + playlist.id + '&view=coverart';
        this.playlistURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousPlaylistURL);
        //console.log('Updated:' + this.dangerousPlaylistURL);
      }
    });
  }

  upvote(track: Track) {
    if (this.spotifyUser.id === 'unidentified_user') {
      return;
    }
    //console.log(this.tracklistKeys);
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
      console.log(track.name + ': ' + track.votes + ' to ' + (track.votes + 1));
      // track.votes += 1;
      console.log('upvote');
      console.log('Key: ' + this.tracklistKeys[index] + 'Name: ' + this.tracklistTracks[index].name);
      return this.db.list('tracks').update(this.tracklistKeys[index], ({ votes: track.votes + 1}));
    }

  }

  downvote(track: Track) {
    if (this.spotifyUser.id === 'unidentified_user') {
      return;
    }
    //console.log(this.tracklistKeys);
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
      console.log(track.name + ': ' + track.votes + ' to ' + (track.votes - 1));

      // track.votes -= 1;
      console.log('downvote');
      console.log('Key: ' + this.tracklistKeys[index] + 'Name: ' + this.tracklistTracks[index].name);
      return this.db.list('tracks').update(this.tracklistKeys[index], ({ votes: track.votes - 1}));
    }

  }
}


