import { Component, OnInit } from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {Tracks, TrackSearchResults} from '../track';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {
  queryterm: string;
  trackSearchResults: TrackSearchResults;
  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  onSearch() {
    // this.spotifyService.searchForTrack(this.queryterm)
    //   .subscribe(
    //     data => this.trackSearchResults = JSON.parse(JSON.stringify(data['tracks']['items'])),
    //     error => console.log(error)
    //   );
    this.spotifyService.searchForTrack(this.queryterm)
      .subscribe(
        (data: TrackSearchResults) => {
          this.trackSearchResults = data['tracks'];
          console.log(this.trackSearchResults.items);
        },
        error => console.log(error)
      );
  }

}

