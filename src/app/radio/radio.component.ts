import {Component, OnInit} from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {Track, Tracks, TrackSearchResults} from '../models/track';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {DataService} from '../data-service';
import {SpotifyUser} from '../models/user.interface';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {resolveTiming} from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})


export class RadioComponent implements OnInit {
  queryterm: string;
  trackSearchResults: TrackSearchResults;
  spotifyUser: SpotifyUser;
  playlistToCreate: string = 'UpNextPlaylist';
  tracksFromFirestore: Observable<any[]>;
  private dbTrackList: Track[];


  constructor(public spotifyService: SpotifyService, private sanitizer: DomSanitizer,
              private dataService: DataService, private db: AngularFireDatabase) {
    // this.tracksFromFirestore = db.list('tracks').valueChanges();

  }

  ngOnInit() {
    this.db.list<Track>('tracks').valueChanges().subscribe((data: Track[]) => {
      this.dbTrackList = data;
      console.log(data);
    });
  }

  onSearch() {
    if (this.queryterm === undefined || this.queryterm === '') {
      alert('Error: Please type a search term in!');
      return;
    }
    this.dataService.getUserID().subscribe((data: SpotifyUser) => this.spotifyUser = data); //gets user_id

    if (this.spotifyUser.id === 'unidentified_user') {
      alert('Error: Please login before searching a term!');
      return;
    }
    this.spotifyService.searchForTrack(this.queryterm)
      .subscribe(
        (data: TrackSearchResults) => {
          this.trackSearchResults = data['tracks'];
          // console.log('Track Search Results: ' + JSON.stringify(this.trackSearchResults.items));
        },
        error => console.log(error)
      );

  }


  /**
   * Needs to add a track to the database and a spotify playlist
   * AND
   * Needs to add a track to a list that can be shared with HomeComponent (https://angular.io/guide/component-interaction)
   * to allow the name/etc to be accessed/displayed on the HomeComponent.
   * @param {Track} track - The track to add
   */

  async onAddTrack(track: Track) {
    let check = false;
    await this.dbTrackList.forEach(function (element) {
      if (element.id === track.id) {
        alert('Error: That track already exists in the playlist!');
        check = true;
      }
    });
    if (check) {
      return;
    }
    this.dataService.getUserID().subscribe((data: SpotifyUser) => this.spotifyUser = data); //gets user_id
    console.log('Logging Data: ' + this.spotifyUser.id);
    console.log('Track ID: ' + track.id);
    // this.spotifyService.createPlaylist(this.playlistToCreate, this.spotifyUser.id); //if can get angular5-spotify to work with createPlaylist
    // if playlist does not already exist create a playlist
    this.containsPlaylist(this.playlistToCreate).filter(result => !result).switchMap(() =>
      this.spotifyService.createPlaylist(this.playlistToCreate, this.spotifyUser.id)).subscribe(data => this.dataService.updatePlaylistID(data.id));


    const items = this.db.list('tracks');
    let t2: Track = track;
    t2.votes = 0;
    items.push(t2);
  }

  containsPlaylist(playlistToCreate: string): Observable<boolean> {
    return this.spotifyService.getUserPlaylists().map(data => data.items).map(arrayOfTracks =>
      arrayOfTracks.some(track => track.name === playlistToCreate));
  }

}

