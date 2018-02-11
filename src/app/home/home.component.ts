import { Component, OnInit } from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {ActivatedRoute} from '@angular/router';
import {Track} from '../track';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  title = 'UpNext';
  track: any;
  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute) { }

  ngOnInit() {
   //  // this.route.params.map(params => params['id']).subscribe((id) =>
   //  // { this.spotifyService.getTrack(id).subscribe(track => this.track = track); })
   //  console.log('working');
   //  // this.spotifyService.getTrack('6rqhFgbbKwnb9MLmUQDhG6').subscribe(track => this.track = track);
   // // console.log(this.track.name);
  }
  onClick() {
    //this.spotifyService.getTrack();

    this.spotifyService.getTrack('6rqhFgbbKwnb9MLmUQDhG6').subscribe(track => this.track = track);
    console.log(this.track.stringify());


  }

}
