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
      // console.log('NGONINIT: ' + this.dbTrackList[0].id);
    });
    // this.spotifyService.getTracks()
    //   .subscribe((data: Tracks) => {
    //     this.trackList = data;
    //     console.log(this.trackList.tracks);
    //   } );
  }

  onClick() {
    //TODO figure out
    // this.spotifyService.getTrack('3n3Ppam7vgaVa1iaRUc9Lp').subscribe(data => console.log(data));

      this.spotifyService.getTrack('3n3Ppam7vgaVa1iaRUc9Lp').subscribe(data => this.track = {
        name: data.name,
        artist: data.artists['0'].name,
        id: data.id,
        uri: data.uri
      }
    );

    let arr = ['3n3Ppam7vgaVa1iaRUc9Lp', '6rPO02ozF3bM7NnOV4h6s2'];

    // this.spotifyService.getTracks(arr).subscribe(data => console.log(JSON.parse(JSON.stringify(data['tracks']))));
    this.spotifyService.getTracks(arr)
      .subscribe((data: Tracks) => {
        this.trackList = data;
        console.log(this.trackList.tracks);
      } );
    // this.spotifyService.getTracks(arr)
    //   .subscribe((data: Track[]) => {
    //     this.trackList = data;
    //     console.log(this.trackList[0]);
    //   })
    console.log(this.spotifyService);

  }

  displayTrack() {
    // console.log(this.track);
    // console.log('Display Tracks: ');
    // console.log(this.trackList);
    // console.log('Display::' + this.tracktest.tracks);
  }
}


