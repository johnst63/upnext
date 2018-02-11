import {Component, OnInit} from '@angular/core';
import {SpotifyService} from '../angular5-spotify';
import {ActivatedRoute} from '@angular/router';
import {Track} from '../track';
import {Album} from '../../Album';
import {parseHttpResponse} from 'selenium-webdriver/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  title = 'UpNext';
  track: Track;
  album: Album[];

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute) {
  }

  ngOnInit() {

  }

  onClick() {
    //TODO figure out
    this.spotifyService.getTrack('3n3Ppam7vgaVa1iaRUc9Lp').subscribe(data => this.track = {
      name: data['name'],
      artists: data['artists'],
      available_markets: data['available_markets'],
      disc_number: data['disc_number'],
      duration_ms: data['duration_ms'],
      explicit: data['explicit'],
      external_urls: data['external_urls'],
      href: data['href'],
      id: data['id'],
      is_playable: data['is_playable'],
      linked_from: data['linked_from'],
      preview_url: data['preview_url'],
      track_number: data['track_number'],
      type: data['type'],
      uri: data['uri']
    });

    console.log(JSON.parse(JSON.stringify(this.track)));
    //console.log(JSON.stringify(this.track));

    console.log(this.spotifyService);

  }

}
