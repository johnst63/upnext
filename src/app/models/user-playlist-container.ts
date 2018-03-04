import {SpotifyUser} from './user.interface';
import {Playlist} from '../../Playlist';

export interface UserPlaylistContainer {
  spotifyUser: SpotifyUser;
  playlist: Playlist;
}
