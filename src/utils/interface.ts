interface Page {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

interface AvailableDevices {
  devices: Device[];
}

interface Device {
  id: string | null;
  is_active: boolean;
  name: string;
  type: string;
  is_private_session: boolean;
  is_restricted: boolean;
  volume_percent: number | null;
}

interface Artist {
  name: string;
  images: Image[];
  id: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  popularity: number;
  type: "artist";
}

interface SimpleArtist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

interface BaseAlbum {
  name: string;
  id: string;
  images: Image[];
  release_date: string;
  uri: string;
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  release_date_precision: "year" | "month" | "day";
  restrictions: {
    reason: "market" | "product" | "explicit";
  };
  type: "album";
  copyrights: [
    {
      text: "string";
      type: "string";
    }
  ];
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  genres: string[];
  label: "string";
  popularity: number;
}

interface Album extends BaseAlbum {
  artists: Artist[];
  tracks: Tracks;
}

interface SimpleAlbum extends BaseAlbum {
  album_group: "album" | "single" | "compilation" | "appears_on";
  artists: SimpleArtist[];
}

interface SavedAlbum extends BaseAlbum {
  artists: Artist[];
  tracks: TracksOfSavedAlbums[];
}

interface Tracks extends Page {
  items: Track[];
}

interface TracksOfSavedAlbums extends Page {
  items: SimpleTrack;
}

interface BaseTrack {
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  restrictions: {
    reason: "market" | "product" | "explicit";
  };
  href: string;
  id: string;
  is_playable: boolean;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

interface SimpleTrack extends BaseTrack {
  artists: SimpleArtist[];
  linked_from: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
}

interface Track extends BaseTrack {
  album: SimpleAlbum;
  artists: Artist[];
  linked_from: {};
  popularity: number;
}

// 不考虑Episode
interface PlayingQueue {
  currently_playing: null | Track;
  queue: Track[];
}

// 搜索结果
interface SearchTracks {
  tracks: Tracks;
}

interface SearchPlaylists {
  playlists: Playlists;
}

interface SearchAlbums {
  albums: Albums;
}

interface SearchArtists {
  artists: PageArtist;
}

// 获取用户歌单和搜索歌单
interface Playlists extends Page {
  items: SimplePlaylist[];
}

interface BasePlaylist {
  collaborative: boolean;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string | null;
      total: number;
    };
    href: string;
    id: string;
    type: "user";
    uri: string;
    display_name: string | null;
  };
  public: boolean;
  snapshot_id: string;
  type: "playlist";
  uri: string;
}

interface Playlist extends BasePlaylist {
  tracks: PagePlaylistTrack;
}

interface PagePlaylistTrack extends Page {
  items: PlaylistTrack[];
}

interface SimplePlaylist extends BasePlaylist {
  tracks: {
    href: string;
    total: number;
  };
}

// 最近播放
interface RecentTracks extends Cursor {
  items: History[];
}

interface History {
  track: Track;
  played_at: string;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  };
}

interface TopTracks extends Page {
  items: Track[];
}

interface SavedAlbums extends Page {
  items: {
    added_at: string;
    album: SavedAlbum;
  };
}

interface Albums extends Page {
  items: SimpleAlbum[];
}

interface Loves extends Page {
  items: SavedTrack[];
}

interface FollowedArtists {
  artists: CursorArtis;
}

interface PageArtist extends Page {
  items: Artist[];
}

interface Cursor {
  href: string;
  limit: number;
  next: string | null;
  cursor: {
    after: string;
    before: string;
  };
  total: number;
}

interface CursorArtis extends Cursor {
  items: Artist[];
}

interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

interface PlaylistTrack {
  track: Track;
  added_by: string;
  added_at: string;
  is_local: boolean;
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

interface Profile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
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
  Playlists,
  Playlist,
  SavedAlbum,
  Loves,
  PageArtist,
  TopTracks,
  RecentTracks,
  PlayingQueue,
  Anchor,
  PlaylistTrack,
  PagePlaylistTrack,
  Tracks,
  SearchAlbums,
  SearchTracks,
  SearchArtists,
  SearchPlaylists,
  Profile,
};
