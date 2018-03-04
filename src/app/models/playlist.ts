export interface Playlist {
  id: string;
  name: string;
}

export interface PlaylistSearchResults {
  playlists: Array<Playlist>;
}
