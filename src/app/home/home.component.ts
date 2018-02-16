import {Component, OnInit} from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {ActivatedRoute} from '@angular/router';
import {Album} from '../../Album';
import {Track, Tracks, TrackSearchResults} from '../models/track';
import {AngularFireDatabase} from 'angularfire2/database';

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

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, private db: AngularFireDatabase) {

  }

  ngOnInit() {

    this.db.list<Track>('tracks').valueChanges().subscribe((data: Track[]) => {
      this.dbTrackList = data;
      console.log(data);
    });
  }
}


