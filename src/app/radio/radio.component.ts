import { Component, OnInit } from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {Track, Tracks, TrackSearchResults} from '../models/track';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {DataService} from '../data-service';
import {SpotifyUser} from '../models/user.interface';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';

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
  playlistID: string;


  constructor(public spotifyService: SpotifyService, private sanitizer: DomSanitizer,
              private dataService: DataService, private db: AngularFireDatabase) {
    // this.tracksFromFirestore = db.list('tracks').valueChanges();

  }

  ngOnInit() {
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

  testAdd() {
    console.log('Adding');
    this.spotifyService.addTracksToPlaylist(this.spotifyUser.id, '7JSeUPTBQnojSTKFOOpSXJ', ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh', 'spotify:track:1301WleyT98MSxVHPZCA6M']);
  }

  /**
   * Needs to add a track to the database and a spotify playlist
   * AND
   * Needs to add a track to a list that can be shared with HomeComponent (https://angular.io/guide/component-interaction)
   * to allow the name/etc to be accessed/displayed on the HomeComponent.
   * @param {Track} track - The track to add
   */
  onAddTrack(track: Track) {
    this.dataService.getUserID().subscribe((data: SpotifyUser) => this.spotifyUser = data); //gets user_id
    console.log('Logging Data: ' + this.spotifyUser.id);
    console.log('Track ID: ' + track.id);

    //TODO need to now add the track to the playlist ...
    this.spotifyService.addTracksToPlaylist(this.spotifyUser.id, this.spotifyService.playlist.id, ['spotify:track:' + track.id]);
    // this.spotifyService.createPlaylist(this.playlistToCreate, this.spotifyUser.id); //if can get angular5-spotify to work with createPlaylist
    // if playlist does not already exist create a playlist
    this.containsPlaylist(this.playlistToCreate).filter(result => !result).switchMap(() =>
      this.spotifyService.createPlaylist(this.playlistToCreate, this.spotifyUser.id)).subscribe(data => this.dataService.updatePlaylistID(data.id));


    const items = this.db.list('tracks');
    items.push(track);
  }

  containsPlaylist(playlistToCreate: string): Observable<boolean> {
    return this.spotifyService.getUserPlaylists().map(data => data.items).map(arrayOfTracks =>
      arrayOfTracks.some(track => track.name === playlistToCreate));
  }

}

