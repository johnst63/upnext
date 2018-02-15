import { Component, OnInit } from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {Track, Tracks, TrackSearchResults} from '../track';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {UpNextUser} from '../models/user.interface';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})


export class RadioComponent implements OnInit {
  queryterm: string;
  trackSearchResults: TrackSearchResults;
  private user: UpNextUser;
  // private dangerousTrackUrl: string;
  // private validUrl: SafeResourceUrl;

  constructor(private spotifyService: SpotifyService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  onSearch() {

    this.spotifyService.searchForTrack(this.queryterm)
      .subscribe(
        (data: TrackSearchResults) => {
          this.trackSearchResults = data['tracks'];
          console.log(this.trackSearchResults.items);
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
  onAddTrack(track: Track) {
    console.log('Track ID: ' + track.id);
    this.spotifyService.getUserInfo().subscribe((data: UpNextUser) => this.user = data);
    // this.spotifyService.createPlaylist('PlaylistX', 'mojomaster96').subscribe(
    //   data => console.log(data),
    //   error => console.log(error));

  }
  //
  // updateTrackUrl(track: Track) {
  //   this.dangerousTrackUrl = 'https://open.spotify.com/embed?uri=spotify:user:' + track.uri;
  //   this.validUrl =
  //     this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousTrackUrl);
  //   return this.validUrl;
  // }

}

