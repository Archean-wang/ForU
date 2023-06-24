interface Artist {
    name: string
    images: Image[]
    id: string
}

interface Album {
    name: string
    id: string
    images: Image[]
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

export type {Album, Artist, Track, TrackItems, Playlist, SavedAlbum}