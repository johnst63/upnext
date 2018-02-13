import { Component, OnInit } from '@angular/core';
import {SpotifyService} from '../angular5-spotify';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {
  queryterm: string;
  trackSearchResults = [];
  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  onSearch() {
    // this.spotifyService.searchForTrack(this.queryterm)
    //   .subscribe(
    //     ,
    //       error => console.log(error)
    //   );
    this.spotifyService.searchForTrack(this.queryterm)
      .subscribe(
        data => this.trackSearchResults = JSON.parse(JSON.stringify(data['tracks']['items'])),
        error => console.log(error)
      );
  }

}

export interface Track {
  name: string;
  artist: string;
}

export interface TrackList {
  tracks: any[];
}
