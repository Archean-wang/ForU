interface Device {
    id: string
    is_active: boolean
    name: string
    type: string
}

interface Artist {
    name: string
    images: Image[]
    id: string
    uri: string
}

interface Album {
    name: string
    id: string
    images: Image[]
    release_date: string
    uri: string
  }
  
interface Track {
    name: string
    artists: Array<Artist>
    id: string
    album: Album
    duration_ms: number
    uri: string
  }
  
interface TrackItems {
    track: Track
}

interface PlayingQueue {
    currently_playing: null | Track
    queue: Track[]
}

interface Playlists {
    href: string
    limit: number
    next: string
    offset: number
    previous: string
    total: number
    items: Playlist[]
}

interface History {
    track: Track
    played_at: string
}

interface RecentTracks {
    href: string
    limit: number
    next: string
    total: number
    items: History[]
}

interface TopTracks {
    href: string
    limit: number
    next: string
    offset: number
    previous: string
    total: number
    items: Track[]
}

interface TopArtists {
    href: string
    limit: number
    next: string
    offset: number
    previous: string
    total: number
    items: Artist[]
}

interface Albums {
    href: string
    limit: number
    next: string
    offset: number
    previous: string
    total: number
    items: SavedAlbum[]
}

interface Loves {
    href: string
    limit: number
    next: string
    offset: number
    previous: string
    total: number
    items: SavedTrack[]
}

interface FollowedArtists {
    artists: Artists
}

interface Artists {
    href: string
    limit: number
    next: string
    total: number
    items: Artist[]
}

interface Playlist {
    name: string
    id:string
    images: Image[]
    description: string
    uri: string
}

interface Image {
    url:string,
}

interface PlaylistTrack {
    track: Track
    added_at: string
}

// get user saved albums
interface SavedAlbum {
    album: Album
    added_at: string
}

interface SavedTrack {
    track: Track
    added_at: string
}

// 右键菜单位置
interface Anchor {
    mouseX: number;
    mouseY: number;
}


export type {Device, Albums, Album, FollowedArtists, Artist, Track, TrackItems, Playlists,
     Playlist, SavedAlbum, Loves, TopArtists, TopTracks, RecentTracks, PlayingQueue, Anchor, PlaylistTrack}