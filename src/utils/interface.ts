import { search } from "../api";

interface Device {
  id: string;
  is_active: boolean;
  name: string;
  type: string;
}

interface AvailableDevices {
  devices: Device[];
}

interface Artist {
  name: string;
  images: Image[];
  id: string;
  uri: string;
}

interface Album {
  name: string;
  id: string;
  images: Image[];
  release_date: string;
  uri: string;
}

interface SearchTracks {
  tracks: Tracks;
}

interface Tracks {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Track[];
}

interface Track {
  name: string;
  artists: Array<Artist>;
  id: string;
  album: Album;
  duration_ms: number;
  uri: string;
}

interface TrackItems {
  track: Track;
}

interface PlayingQueue {
  currently_playing: null | Track;
  queue: Track[];
}

interface SearchPlaylists {
  playlists: Playlists;
}

interface Playlists {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Playlist[];
}

interface History {
  track: Track;
  played_at: string;
}

interface RecentTracks {
  href: string;
  limit: number;
  next: string;
  total: number;
  items: History[];
}

interface TopTracks {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Track[];
}

interface SearchArtists {
  artists: Artists;
}

interface Artists {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Artist[];
}

interface SavedAlbums {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: SavedAlbum[];
}

interface SearchAlbums {
  albums: Albums;
}

interface Albums {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Album[];
}

interface Loves {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: SavedTrack[];
}

interface FollowedArtists {
  artists: Artists;
}

interface Artists {
  href: string;
  limit: number;
  next: string;
  total: number;
  items: Artist[];
}

interface Playlist {
  name: string;
  id: string;
  images: Image[];
  description: string;
  uri: string;
  snapshot_id: string;
  owner: {
    id: string;
  };
}

interface Image {
  url: string;
}

interface PlaylistTracks {
  href: string;
  total: number;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  items: PlaylistTrack[];
}

interface PlaylistTrack {
  track: Track;
  added_at: string;
}

// get user saved albums
interface SavedAlbum {
  album: Album;
  added_at: string;
}

interface SavedTrack {
  track: Track;
  added_at: string;
}

// 右键菜单位置
interface Anchor {
  mouseX: number;
  mouseY: number;
}

export type {
  Device,
  AvailableDevices,
  SavedAlbums,
  Albums,
  Album,
  FollowedArtists,
  Artist,
  Track,
  TrackItems,
  Playlists,
  Playlist,
  SavedAlbum,
  Loves,
  Artists,
  TopTracks,
  RecentTracks,
  PlayingQueue,
  Anchor,
  PlaylistTrack,
  PlaylistTracks,
  Tracks,
  SearchAlbums,
  SearchTracks,
  SearchArtists,
  SearchPlaylists,
};
