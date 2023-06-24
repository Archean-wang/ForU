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
        if (res.status === 204)
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
        if (res.status !== 204) {
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
        if (res.status !== 204) {
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

async function startPlayback(context_uri: string, offset: number | string, position_ms: number=0) {
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

export { getUserProfile, getPlaylists, transfer, getArtists, getAlbums,
    setRepeatMode, setShuffleMode, getPlayingQueue, getPlaybackState, startPlayback,
    getPlaylist, getPlaylistInfo, getAlbum, getAlbumInfo
 }