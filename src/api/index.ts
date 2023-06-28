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

async function startPlayback(context_uri: string, offset: number | string=0, position_ms: number=0) {
    try {
        let off = typeof offset === "number" ? {position: offset} : {uri: offset}
        const res = await http.put(`/me/player/play`, {
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

async function playTracks(uris:string[], position_ms: number=0) {
    try {
        const res = await http.put(`/me/player/play`, {
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

async function getAlbum(aid: string) {
    try {
        const res = await http.get(`/albums/${aid}/tracks`)
        if (res.status!=200) {
            console.error(`Error when get album tracks: ${aid}, ${res.data}`)
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

export { getUserProfile, getPlaylists, getTracks, checkTracks, loveTracks, search, unloveTracks ,transfer, getArtists, getAlbums,
    setRepeatMode, setShuffleMode, getPlayingQueue, getPlaybackState, startPlayback,playTracks,
    getPlaylist, getPlaylistInfo, getAlbum, getAlbumInfo, getArtistTop, getArtistAlbums, getRelatedArtist
 }