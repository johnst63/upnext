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
   success: boolean = false;

  constructor(public spotifyService: SpotifyService, private sanitizer: DomSanitizer,
              private dataService: DataService, private db: AngularFireDatabase) {
    this.tracksFromFirestore = db.list('tracks').valueChanges();

  }

  ngOnInit() {
  }

  onSearch(): boolean {
      this.spotifyService.searchForTrack(this.queryterm)
      .subscribe(
        (data: TrackSearchResults) => {

          this.trackSearchResults = data['tracks'];
          if (this.trackSearchResults.items !== null) {
            this.success = true;
          }
          console.log(this.trackSearchResults.items);
        },
        error => console.log(error)
      );
  return this.success;
  }


  /**
   * Needs to add a track to the database and a spotify playlist
   * AND
   * Needs to add a track to a list that can be shared with HomeComponent (https://angular.io/guide/component-interaction)
   * to allow the name/etc to be accessed/displayed on the HomeComponent.
   * @param {Track} track - The track to add
   */
  onAddTrack(track: Track) {
    this.dataService.getData().subscribe((data: SpotifyUser) => this.spotifyUser = data); //gets user_id
    console.log('Logging Data: ' + this.spotifyUser.id);
    console.log('Track ID: ' + track.id);
    //if playlist does not already exist create a playlist
    let playlistSearchResults: TrackSearchResults;
    let alreadyExists: boolean = false;
    this.spotifyService.getUserPlaylists().subscribe(data => {
      playlistSearchResults = data;
      playlistSearchResults.items.forEach(f => {
          if (f.name === this.playlistToCreate) {
            alreadyExists = true;
          }
        }
      );
    });
    if (!alreadyExists) {
      this.spotifyService.createPlaylist(this.playlistToCreate, this.spotifyUser.id).subscribe(
        data => console.log('Successfully Created Playlist!'),
        error => console.log(error));
    }
    const items = this.db.list('tracks');

    items.push(track.id);
  }
  //
  // updateTrackUrl(track: Track) {
  //   this.dangerousTrackUrl = 'https://open.spotify.com/embed?uri=spotify:user:' + track.uri;
  //   this.validUrl =
  //     this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousTrackUrl);
  //   return this.validUrl;
  // }

}

