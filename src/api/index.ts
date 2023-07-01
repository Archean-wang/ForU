import { PlaylistDetail } from "../components/EditPlaylist";
import http from "../utils/http";

async function getPlaylists() {
    try {
        const res = await http.get("/me/playlists");
        if (res.status === 200)
            return res.data;
        console.warn(`Error when get playlists: ${res.data}`);
    }
    catch (err) {
        console.error(`Error when get playlists: ${err}`);
    }
}

async function getAlbums() {
    try {
        const res = await http.get("/me/albums");
        if (res.status === 200)
            return res.data;
        console.warn(`Error when get playlists: ${res.data}`);
    }
    catch (err) {
        console.error(`Error when get playlists: ${err}`);
    }
}

async function getArtists() {
    try {
        const res = await http.get("/me/following", { params: { type: "artist" } });
        if (res.status === 200)
            return res.data;
        console.warn(`Error when get playlists: ${res.data}`);
    }
    catch (err) {
        console.error(`Error when get playlists: ${err}`);
    }
}

async function getTracks(offset=0) {
    try {
        const res = await http.get("/me/tracks", { params: { limit: 50, offset } });
        if (res.status === 200)
            return res.data;
        console.warn(`Error when get tracks: ${res.data}`);
    }
    catch (err) {
        console.error(`Error when get tracks: ${err}`);
    }
}

async function checkTracks(ids:string) {
    try {
        const res = await http.get("/me/tracks/contains", { params: { ids} });
        if (res.status === 200)
            return res.data;
        console.warn(`Error when check tracks: ${res.data}`);
    }
    catch (err) {
        console.error(`Error when check tracks: ${err}`);
    }
}

async function loveTracks(ids:string) {
    try {
        const res = await http.put(`/me/tracks?ids=${ids}`);
        if (res.status === 200)
            return res.data;
        console.warn(`Error when love tracks: ${res.data}`);
    }
    catch (err) {
        console.error(`Error when love tracks: ${err}`);
    }
}

async function unloveTracks(ids:string) {
    try {
        const res = await http.delete(`/me/tracks?ids=${ids}`);
        if (res.status === 200)
            return res.data;
        console.warn(`Error when unlove tracks: ${res.data}`);
    }
    catch (err) {
        console.error(`Error when unlove tracks: ${err}`);
    }
}

async function getUserProfile() {
    try {
        const res = await http.get("/me");
        if (res.status === 200)
            return res.data;
        console.warn(`Error when get user profile: ${res.data}`);
    }
    catch (err) {
        console.error(`Error when get user profile: ${err}`);
    }
}

async function transfer(device_id: string, play: boolean) {
    try {
        const res = await http.put("/me/player",
            { device_ids: [device_id], play: play });
        if (res.status === 202)
            return res.data;
        console.warn(`Error when transfer: ${res.data}`);
    }
    catch (err) {
        console.error(`Error when transfer: ${err}`);
    }
}

async function setRepeatMode(mode: string, device_id: string | undefined) {
    try {
        const res = await http.put(`/me/player/repeat?state=${mode}`);
        if (res.status >= 300) {
            console.warn(`Error when set repeat mode: ${res.data}`);
            return false;
        }
        return true;
    }
    catch (err) {
        console.error(`Error when set repeat mode: ${err}`);
    }
}

async function setShuffleMode(mode: boolean, device_id: string | undefined) {
    try {
        const res = await http.put(`/me/player/shuffle?state=${mode}`);
        if (res.status >= 300) {
            console.warn(`Error when set shuffle mode: ${res.data}`);
            return false;
        }
        return true;
    }
    catch (err) {
        console.error(`Error when set shuffle mode: ${err}`);
    }
}

async function getPlayingQueue() {
    try {
        const res = await http.get(`/me/player/queue`);
        if (res.status !== 200) {
            console.warn(`Error when get playing queue: ${res.data}`);
            return res.data;
        }
        return res.data;
    }
    catch (err) {
        console.error(`Error when get playing queue: ${err}`);
    }
}

async function getPlaybackState() {
    try {
        const res = await http.get(`/me/player`);
        if (res.status !== 200) {
            console.warn(`Error when get playback state: ${res.data}`);
            return res.data;
        }
        return res.data;
    }
    catch (err) {
        console.error(`Error when get playback state: ${err}`);
    }
}

async function startPlayback(context_uri: string, offset: number | string=0,device_id: string|null=null, position_ms: number=0) {
    try {
        const url = device_id ? `/me/player/play?device_id=${device_id}` : "/me/player/play";
        let off = typeof offset === "number" ? {position: offset} : {uri: offset}
        const res = await http.put(url, {
            context_uri: context_uri, offset: off, position_ms: position_ms
        });
        if (res.status !== 204) {
            console.warn(`Error when get start state: ${res.data}`);
        }
        return res.data;
    }
    catch (err) {
        console.error(`Error when get start state: ${err}`);
    }
}

async function playTracks(uris:string[], device_id: string|null=null, position_ms: number=0) {
    try {
        const url = device_id ? `/me/player/play?device_id=${device_id}` : "/me/player/play";
        const res = await http.put(url, {
            uris, position_ms: position_ms
        });
        if (res.status !== 204) {
            console.warn(`Error when get start state: ${res.data}`);
        }
        return res.data;
    }
    catch (err) {
        console.error(`Error when get start state: ${err}`);
    }
}

async function getPlaylist(pid: string) {
    try {
        const res = await http.get(`/playlists/${pid}/tracks`)
        if (res.status!=200) {
            console.error(`Error when get playlist tracks: ${pid}, ${res.data}`)
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when get playlist tracks: ${pid}, ${err}`)
    }
}

async function search(kw: string, type:string="track,artist,album,playlist") {
    try {
        const res = await http.get(`/search`, {params: {q: kw, type}})
        if (res.status!=200) {
            console.error(`Error when search: ${res.data}`)
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when search: ${err}`)
    }
}

async function getPlaylistInfo(pid: string) {
    try {
        const res = await http.get(`/playlists/${pid}`)
        if (res.status!=200) {
            console.error(`Error when get playlist info: ${pid}, ${res.data}`)
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when get playlist info: ${pid}, ${err}`)
    }
}

async function checkPlaylist(pid: string, ids: string) {
    try {
        const res = await http.get(`/playlists/${pid}/followers/contains`, {params: {ids }});
        if (res.status!=200) {
            console.error(`Error when check playlist : ${pid}, ${res.data}`);
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when check playlist : ${pid}, ${err}`);
    }
}

async function checkAlbums(aids: string) {
    try {
        const res = await http.get(`/me/albums/contains`, {params: {ids: aids }});
        if (res.status!=200) {
            console.error(`Error when check albums : ${aids}, ${res.data}`);
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when check albums : ${aids}, ${err}`);
    }
}

async function checkArtists(aids: string) {
    try {
        const res = await http.get(`/me/following/contains`, {params: {ids: aids, type: "artist" }});
        if (res.status!=200) {
            console.error(`Error when check artists : ${aids}, ${res.data}`);
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when check artists : ${aids}, ${err}`);
    }
}

async function followArtists(aids: string) {
    try {
        const res = await http.put(`/me/following?type=artist&ids=${aids}`);
        if (res.status>=300) {
            console.error(`Error when follow artists : ${aids}, ${res.data}`);
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when follow artists : ${aids}, ${err}`);
    }
}

async function unfollowArtists(aids: string) {
    try {
        const res = await http.delete(`/me/following`, {params: {ids: aids, type: "artist" }});
        if (res.status>=300) {
            console.error(`Error when unfollow artists : ${aids}, ${res.data}`);
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when unfollow artists : ${aids}, ${err}`);
    }
}

async function followPlaylist(pid: string) {
    try {
        const res = await http.put(`/playlists/${pid}/followers`);
        if (res.status!=200) {
            console.error(`Error when follow playlist : ${pid}, ${res.data}`);
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when follow playlist : ${pid}, ${err}`);
    }
}


async function followAlbum(aids: string) {
    try {
        const res = await http.put(`/me/albums?ids=${aids}`);
        if (res.status!=200) {
            console.error(`Error when follow albums : ${aids}, ${res.data}`);
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when follow albums : ${aids}, ${err}`);
    }
}

async function unfollowAlbum(aids: string) {
    try {
        const res = await http.delete(`/me/albums?ids=${aids}`);
        if (res.status!=200) {
            console.error(`Error when unfollow albums : ${aids}, ${res.data}`);
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when unfollow albums : ${aids}, ${err}`);
    }
}

async function unfollowPlaylist(pid: string) {
    try {
        const res = await http.delete(`/playlists/${pid}/followers`);
        if (res.status!=200) {
            console.error(`Error when unfollow playlist : ${pid}, ${res.data}`);
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when unfollow playlist : ${pid}, ${err}`);
    }
}

async function getAlbum(aid: string) {
    try {
        const res = await http.get(`/albums/${aid}/tracks`);
        if (res.status!=200) {
            console.error(`Error when get album tracks: ${aid}, ${res.data}`);
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when get album tracks: ${aid}, ${err}`)
    }
}

async function getAlbumInfo(aid: string) {
    try {
        const res = await http.get(`/albums/${aid}`)
        if (res.status!=200) {
            console.error(`Error when get album info: ${aid}, ${res.data}`)
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when get album info: ${aid}, ${err}`)
    }
}

async function getArtist(aid: string) {
    try {
        const res = await http.get(`/artists/${aid}`)
        if (res.status!=200) {
            console.error(`Error when get artist: ${aid}, ${res.data}`)
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when get artist: ${aid}, ${err}`)
    }
}

async function getArtistTop(aid: string, country:string="HK") {
    try {
        const res = await http.get(`/artists/${aid}/top-tracks`, {params: {market: country}})
        if (res.status!=200) {
            console.error(`Error when get artist top: ${aid}, ${res.data}`)
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when get artist top: ${aid}, ${err}`)
    }
}

async function getArtistAlbums(aid: string) {
    try {
        const res = await http.get(`/artists/${aid}/albums`)
        if (res.status!=200) {
            console.error(`Error when get artist albums: ${aid}, ${res.data}`)
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when get artist albums: ${aid}, ${err}`)
    }
}

async function getRelatedArtist(aid: string) {
    try {
        const res = await http.get(`/artists/${aid}/related-artists`)
        if (res.status!=200) {
            console.error(`Error when get artist related-artists: ${aid}, ${res.data}`)
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when get artist related-artists: ${aid}, ${err}`)
    }
}

async function changePlaylistCover(pid: string, data:string) {
    try {
        const res = await http.put(`/playlists/${pid}/images`, data)
        if (res.status>=300) {
            console.error(`Error when change playlist cover: ${pid}, ${res.data}`)
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when get change playlist cover: ${pid}, ${err}`)
    }
}

async function changePlaylistDetail(pid: string, data:PlaylistDetail) {
    try {
        const res = await http.put(`/playlists/${pid}`, {name:data.name, description: data.description})
        if (res.status>=300) {
            console.error(`Error when change playlist detail: ${pid}, ${res.data}`)
        }
        return res.data;
    }
    catch(err) {
        console.error(`Error when get change playlist codetailver: ${pid}, ${err}`)
    }
}

export { getUserProfile, getPlaylists, getTracks, checkTracks, loveTracks, search, unloveTracks ,transfer, getArtists, getAlbums,
    setRepeatMode, setShuffleMode, getPlayingQueue, getPlaybackState, startPlayback,playTracks,
    getPlaylist, getPlaylistInfo,checkPlaylist, followPlaylist,unfollowPlaylist, getAlbum, checkAlbums,
    followAlbum, unfollowAlbum, checkArtists, followArtists, unfollowArtists,
     getAlbumInfo, getArtistTop, getArtistAlbums, getRelatedArtist, getArtist, changePlaylistCover, changePlaylistDetail
 }