import { PlaylistDetail } from "../components/EditPlaylist";
import http from "../utils/http";

async function getPlaylists() {
    try {
        const res = await http.get("/me/playlists");
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when get playlists: ${err}`);
    }
}

async function getAlbums() {
    try {
        const res = await http.get("/me/albums");
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when get playlists: ${err}`);
    }
}

async function getArtists() {
    try {
        const res = await http.get("/me/following", { params: { type: "artist" } });
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when get playlists: ${err}`);
    }
}

async function getTracks(offset=0) {
    try {
        const res = await http.get("/me/tracks", { params: { limit: 50, offset } });
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when get tracks: ${err}`);
    }
}

async function checkTracks(ids:string) {
    try {
        const res = await http.get("/me/tracks/contains", { params: { ids} });
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when check tracks: ${err}`);
    }
}

async function loveTracks(ids:string) {
    try {
        const res = await http.put(`/me/tracks?ids=${ids}`);
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when love tracks: ${err}`);
    }
}

async function unloveTracks(ids:string) {
    try {
        const res = await http.delete(`/me/tracks?ids=${ids}`);

        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when unlove tracks: ${err}`);
    }
}

async function getUserProfile() {
    try {
        const res = await http.get("/me");
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when get user profile: ${err}`);
    }
}

async function transfer(device_id: string, play: boolean=false) {
    try {
        const res = await http.put("/me/player",
            { device_ids: [device_id], play: play });
        return res.data
    }
    catch (err) {
        return Promise.reject(`Error when transfer: ${err}`);
    }
}

async function setRepeatMode(mode: string, device_id: string | undefined) {
    try {
        const res = await http.put(`/me/player/repeat?state=${mode}`);
        return true;
    }
    catch (err) {
        return Promise.reject(`Error when set repeat mode: ${err}`);
    }
}

async function setShuffleMode(mode: boolean, device_id: string | undefined) {
    try {
        const res = await http.put(`/me/player/shuffle?state=${mode}`);
        return true;
    }
    catch (err) {
        return Promise.reject(`Error when set shuffle mode: ${err}`);
    }
}

async function getPlayingQueue() {
    try {
        const res = await http.get(`/me/player/queue`);
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when get playing queue: ${err}`);
    }
}

async function getPlaybackState() {
    try {
        const res = await http.get(`/me/player`);
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when get playback state: ${err}`);
    }
}

async function startPlayback(context_uri: string, offset: number | string=0,device_id: string|null=null, position_ms: number=0) {
    try {
        const url = device_id ? `/me/player/play?device_id=${device_id}` : "/me/player/play";
        let off = typeof offset === "number" ? {position: offset} : {uri: offset}
        const res = await http.put(url, {
            context_uri: context_uri, offset: off, position_ms: position_ms
        });
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when get start state: ${err}`);
    }
}

async function playTracks(uris:string[], offset:string|number=0, device_id: string|null=null, position_ms: number=0) {
    try {
        const url = device_id ? `/me/player/play?device_id=${device_id}` : "/me/player/play";
        let off = typeof offset === "number" ? {position: offset} : {uri: offset}
        const res = await http.put(url, {
            uris, position_ms: position_ms, offset: off
        });
        return res.data;
    }
    catch (err) {
        return Promise.reject(`Error when get start state: ${err}`);
    }
}

async function getPlaylist(pid: string) {
    try {
        const res = await http.get(`/playlists/${pid}/tracks`)
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get playlist tracks: ${pid}, ${err}`)
    }
}

async function search(kw: string, type:string="track,artist,album,playlist") {
    try {
        const res = await http.get(`/search`, {params: {q: kw, type}})
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when search: ${err}`)
    }
}

async function getPlaylistInfo(pid: string) {
    try {
        const res = await http.get(`/playlists/${pid}`)
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get playlist info: ${pid}, ${err}`)
    }
}

async function checkPlaylist(pid: string, ids: string) {
    try {
        const res = await http.get(`/playlists/${pid}/followers/contains`, {params: {ids }});
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when check playlist : ${pid}, ${err}`);
    }
}

async function createPlaylist(uid: string) {
    try {
        const res = await http.post(`/users/${uid}/playlists`, {name: "新建歌单"});
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when create playlist`);
    }
}

async function checkAlbums(aids: string) {
    try {
        const res = await http.get(`/me/albums/contains`, {params: {ids: aids }});
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when check albums : ${aids}, ${err}`);
    }
}

async function checkArtists(aids: string) {
    try {
        const res = await http.get(`/me/following/contains`, {params: {ids: aids, type: "artist" }});
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when check artists : ${aids}, ${err}`);
    }
}

async function followArtists(aids: string) {
    try {
        const res = await http.put(`/me/following?type=artist&ids=${aids}`);
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when follow artists : ${aids}, ${err}`);
    }
}

async function unfollowArtists(aids: string) {
    try {
        const res = await http.delete(`/me/following`, {params: {ids: aids, type: "artist" }});
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when unfollow artists : ${aids}, ${err}`);
    }
}

async function followPlaylist(pid: string) {
    try {
        const res = await http.put(`/playlists/${pid}/followers`);
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when follow playlist : ${pid}, ${err}`);
    }
}


async function followAlbum(aids: string) {
    try {
        const res = await http.put(`/me/albums?ids=${aids}`);
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when follow albums : ${aids}, ${err}`);
    }
}

async function unfollowAlbum(aids: string) {
    try {
        const res = await http.delete(`/me/albums?ids=${aids}`);
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when unfollow albums : ${aids}, ${err}`);
    }
}

async function unfollowPlaylist(pid: string) {
    try {
        const res = await http.delete(`/playlists/${pid}/followers`);
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when unfollow playlist : ${pid}, ${err}`);
    }
}

async function getAlbum(aid: string) {
    try {
        const res = await http.get(`/albums/${aid}/tracks`);
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get album tracks: ${aid}, ${err}`)
    }
}

async function getAlbumInfo(aid: string) {
    try {
        const res = await http.get(`/albums/${aid}`)
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get album info: ${aid}, ${err}`)
    }
}

async function getArtist(aid: string) {
    try {
        const res = await http.get(`/artists/${aid}`)
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get artist: ${aid}, ${err}`)
    }
}

async function getArtistTop(aid: string, country:string="HK") {
    try {
        const res = await http.get(`/artists/${aid}/top-tracks`, {params: {market: country}})
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get artist top: ${aid}, ${err}`)
    }
}

async function getArtistAlbums(aid: string) {
    try {
        const res = await http.get(`/artists/${aid}/albums`)
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get artist albums: ${aid}, ${err}`)
    }
}

async function getRelatedArtist(aid: string) {
    try {
        const res = await http.get(`/artists/${aid}/related-artists`)
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get artist related-artists: ${aid}, ${err}`)
    }
}

async function changePlaylistCover(pid: string, data:string) {
    try {
        const res = await http.put(`/playlists/${pid}/images`, data)
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get change playlist cover: ${pid}, ${err}`)
    }
}

async function changePlaylistDetail(pid: string, data:PlaylistDetail) {
    try {
        const res = await http.put(`/playlists/${pid}`, {name:data.name, description: data.description});
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get change playlist detail: ${pid}, ${err}`);
    }
}

async function getDevices() {
    try {
        const res = await http.get("/me/player/devices");
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get devices: ${err}`);
    }
}

async function getTop(type: string) {
    try {
        const res = await http.get(`/me/top/${type}`);
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get top ${type}: ${err}`);
    }
}

async function getRecentTracks() {
    try {
        const res = await http.get(`/me/player/recently-played`);
        return res.data;
    }
    catch(err) {
        return Promise.reject(`Error when get recent trakcs: ${err}`);
    }
}

export { getUserProfile, getPlaylists, getTracks, checkTracks, loveTracks, search, unloveTracks ,transfer, getArtists, getAlbums,
    setRepeatMode, setShuffleMode, getPlayingQueue, getPlaybackState, startPlayback,playTracks, getTop, getRecentTracks,
    getPlaylist, getPlaylistInfo,checkPlaylist, followPlaylist,unfollowPlaylist, getAlbum, checkAlbums,
    followAlbum, unfollowAlbum, checkArtists, followArtists, unfollowArtists, createPlaylist, getDevices,
     getAlbumInfo, getArtistTop, getArtistAlbums, getRelatedArtist, getArtist, changePlaylistCover, changePlaylistDetail
 }