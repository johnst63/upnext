import {Component, OnInit} from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {ActivatedRoute} from '@angular/router';
import {Album} from '../../Album';
import {Track, Tracks, TrackSearchResults} from '../models/track';
import {AngularFireDatabase} from 'angularfire2/database';
import {DataService} from '../data-service';
import {SpotifyUser} from '../models/user.interface';

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

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, private db: AngularFireDatabase, private dataService: DataService) {

  }

  ngOnInit() {

    this.db.list<Track>('tracks').valueChanges().subscribe((data: Track[]) => {
      this.dbTrackList = data;
      console.log(data);
    });
    this.dataService.getUserID().subscribe((data: SpotifyUser) => this.spotifyUser = data); //gets user_id
    this.spotifyService.getPlaylist(this.spotifyUser.id, '');
  }
}


