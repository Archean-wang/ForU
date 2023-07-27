import { PlaylistDetail } from "../components/common/EditPlaylist";
import http from "../utils/http";
import {
  Albums,
  AvailableDevices,
  FollowedArtists,
  Loves,
  PlayingQueue,
  Playlist,
  Playlists,
  RecentTracks,
  TopArtists,
  TopTracks,
} from "../utils/interface";

async function getPlaylists(): Promise<Playlists> {
  return await http.get("/me/playlists");
}

async function getAlbums(): Promise<Albums> {
  return await http.get("/me/albums");
}

async function getArtists(): Promise<FollowedArtists> {
  return await http.get("/me/following", { params: { type: "artist" } });
}

async function getTracks(offset = 0): Promise<Loves> {
  return await http.get("/me/tracks", { params: { limit: 50, offset } });
}

async function checkTracks(ids: string): Promise<boolean[]> {
  return await http.get("/me/tracks/contains", { params: { ids } });
}

async function loveTracks(ids: string) {
  return await http.put(`/me/tracks?ids=${ids}`);
}

async function unloveTracks(ids: string) {
  return await http.delete(`/me/tracks?ids=${ids}`);
}

async function getUserProfile() {
  return await http.get("/me");
}

async function transfer(device_id: string, play: boolean = false) {
  return await http.put("/me/player", { device_ids: [device_id], play: play });
}

async function setRepeatMode(mode: string, device_id: string | undefined) {
  return await http.put(`/me/player/repeat?state=${mode}`);
}

async function setShuffleMode(mode: boolean, device_id: string | undefined) {
  return await http.put(`/me/player/shuffle?state=${mode}`);
}

async function getPlayingQueue(): Promise<PlayingQueue> {
  return await http.get(`/me/player/queue`);
}

async function getPlaybackState() {
  return await http.get(`/me/player`);
}

async function startPlayback(
  context_uri: string,
  offset: number | string = 0,
  device_id: string | null = null,
  position_ms: number = 0
) {
  const url = device_id
    ? `/me/player/play?device_id=${device_id}`
    : "/me/player/play";
  let off = typeof offset === "number" ? { position: offset } : { uri: offset };
  return await http.put(url, {
    context_uri: context_uri,
    offset: off,
    position_ms: position_ms,
  });
}

async function playArtist(
  context_uri: string,
  device_id: string | null = null,
  position_ms: number = 0
) {
  const url = device_id
    ? `/me/player/play?device_id=${device_id}`
    : "/me/player/play";
  return await http.put(url, {
    context_uri: context_uri,
    position_ms: position_ms,
  });
}

async function playTracks(
  uris: string[],
  offset: string | number = 0,
  device_id: string | null = null,
  position_ms: number = 0
) {
  const url = device_id
    ? `/me/player/play?device_id=${device_id}`
    : "/me/player/play";
  let off = typeof offset === "number" ? { position: offset } : { uri: offset };
  return await http.put(url, {
    uris,
    position_ms: position_ms,
    offset: off,
  });
}

async function search(
  kw: string,
  type: string = "track,artist,album,playlist"
) {
  return await http.get(`/search`, { params: { q: kw, type } });
}

async function getPlaylistInfo(pid: string) {
  return await http.get(`/playlists/${pid}`);
}

async function checkPlaylist(pid: string, ids: string): Promise<boolean[]> {
  return await http.get(`/playlists/${pid}/followers/contains`, {
    params: { ids },
  });
}

async function createPlaylist(uid: string): Promise<Playlist> {
  return await http.post(`/users/${uid}/playlists`, { name: "新建歌单" });
}

async function checkAlbums(aids: string): Promise<boolean[]> {
  return await http.get(`/me/albums/contains`, { params: { ids: aids } });
}

async function checkArtists(aids: string): Promise<boolean[]> {
  return await http.get(`/me/following/contains`, {
    params: { ids: aids, type: "artist" },
  });
}

async function followArtists(aids: string) {
  return await http.put(`/me/following?type=artist&ids=${aids}`);
}

async function unfollowArtists(aids: string) {
  return await http.delete(`/me/following`, {
    params: { ids: aids, type: "artist" },
  });
}

async function followPlaylist(pid: string) {
  return await http.put(`/playlists/${pid}/followers`);
}

async function followAlbums(aids: string) {
  return await http.put(`/me/albums?ids=${aids}`);
}

async function unfollowAlbums(aids: string) {
  return await http.delete(`/me/albums?ids=${aids}`);
}

async function unfollowPlaylist(pid: string) {
  return await http.delete(`/playlists/${pid}/followers`);
}

async function getAlbumInfo(aid: string) {
  return await http.get(`/albums/${aid}`);
}

async function getArtist(aid: string) {
  return await http.get(`/artists/${aid}`);
}

async function getArtistTop(aid: string, country: string = "HK") {
  return await http.get(`/artists/${aid}/top-tracks`, {
    params: { market: country },
  });
}

async function getArtistAlbums(aid: string) {
  return await http.get(`/artists/${aid}/albums`);
}

async function getRelatedArtist(aid: string) {
  return await http.get(`/artists/${aid}/related-artists`);
}

async function changePlaylistCover(pid: string, data: string) {
  return await http.put(`/playlists/${pid}/images`, data);
}

async function changePlaylistDetail(pid: string, data: PlaylistDetail) {
  return await http.put(`/playlists/${pid}`, {
    name: data.name,
    description: data.description,
  });
}

async function getDevices(): Promise<AvailableDevices> {
  return await http.get("/me/player/devices");
}

async function getTop(type: string): Promise<TopTracks | TopArtists> {
  return await http.get(`/me/top/${type}`);
}

async function getRecentTracks(): Promise<RecentTracks> {
  return await http.get(`/me/player/recently-played`);
}

async function addItemsToPlaylist(pid: string, uris: string[]) {
  return await http.post(`/playlists/${pid}/tracks`, { uris });
}

async function removeItemsFromPlaylist(
  pid: string,
  uris: string[],
  snapshot_id: string
) {
  return await http.delete(`/playlists/${pid}/tracks`, {
    data: {
      tracks: uris.map((v) => {
        return { uri: v };
      }),
      snapshot_id,
    },
  });
}

async function addItemsToQueue(
  uri: string,
  device_id: string | undefined = undefined
) {
  const url = device_id
    ? `/me/player/queue?device_id=${device_id}&uri=${uri}`
    : `/me/player/queue?uri=${uri}`;
  return await http.post(url);
}

export {
  getUserProfile,
  getTop,
  getPlayingQueue,
  getRecentTracks,
  search,
  addItemsToQueue,
  getPlaylists,
  getPlaylistInfo,
  checkPlaylist,
  followPlaylist,
  unfollowPlaylist,
  createPlaylist,
  changePlaylistCover,
  changePlaylistDetail,
  addItemsToPlaylist,
  removeItemsFromPlaylist,
  getTracks,
  checkTracks,
  loveTracks,
  unloveTracks,
  getArtists,
  checkArtists,
  followArtists,
  unfollowArtists,
  playArtist,
  getArtistTop,
  getArtistAlbums,
  getRelatedArtist,
  getArtist,
  getAlbums,
  checkAlbums,
  followAlbums,
  unfollowAlbums,
  getAlbumInfo,
  getPlaybackState,
  startPlayback,
  playTracks,
  getDevices,
  transfer,
  setRepeatMode,
  setShuffleMode,
};
