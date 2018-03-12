// export class Track1 {
//   artists: any[];
//   available_markets: string[];
//   disc_number: number;
//   duration_ms: number;
//   explicit: boolean;
//   external_urls: any;
//   href: string;
//   id: string;
//   is_playable: boolean;
//   linked_from: any;
//   name: string;
//   preview_url: string;
//   track_number: number;
//   type: string;
//   uri: string;
//
//
// }
import {SafeResourceUrl} from '@angular/platform-browser';

export interface Track {
  name: string;
  artist: string;
  id: string;
  uri: string;
  votes: number;
  // url: SafeResourceUrl;
}

export interface Tracks {
  tracks: Array<Track>;
}

export interface TrackSearchResults {
  items: Array<Track>;
}

export interface DatabaseTracks {
  keys: string[];
  tracks: Track[];
}
