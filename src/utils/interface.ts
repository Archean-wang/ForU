interface Artist {
    name: string
    images: Image[]
    id: string
}

interface Album {
    name: string
    id: string
    images: Image[]
    release_date: string
  }
  
interface Track {
    name: string
    artists: Array<Artist>
    id: string
    album: Album
    duration_ms: number
  }
  
interface TrackItems {
    track: Track
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

interface Albums {
    href: string
    limit: number
    next: string
    offset: number
    previous: string
    total: number
    items: SavedAlbum[]
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
}

interface Image {
    url:string,
}

// get user saved albums
interface SavedAlbum {
    album: Album
    aded_at: string
}

export type {Albums, Album, FollowedArtists, Artist, Track, TrackItems, Playlists, Playlist, SavedAlbum}