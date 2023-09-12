import { Box, Tabs, Tab } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import React, { useState } from "react";
import SongList from "../../components/itemsList/SongList";
import { playTracks } from "../../api";
import AlbumList from "../../components/itemsList/AlbumList";

import { useSpotifyDevice } from "spotify-web-playback-sdk-for-react";
import ArtistList from "../../components/itemsList/ArtistList";
import PlaylistList from "../../components/itemsList/PlaylistList";
import http from "../../utils/http";
import {
  SearchAlbums,
  SearchArtists,
  SearchPlaylists,
  SearchTracks,
} from "../../utils/interface";
import Loading from "../../components/common/Loading";
import { useTranslation } from "react-i18next";

function Search() {
  const {
    // @ts-ignore
    searchResult: { tracks, artists, albums, playlists },
  } = useLoaderData();
  const [value, setValue] = useState(0);
  const device = useSpotifyDevice();
  const [trackItems, setTrackItems] = useState(tracks.items);
  const [artistItems, setArtistItems] = useState(artists.items);
  const [albumItems, setAlbumItems] = useState(albums.items);
  const [playlistItems, setPlaylistItems] = useState(playlists.items);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  function handleChange(event: React.SyntheticEvent, newValue: number) {
    setValue(newValue);
  }

  function loadNextAlbums() {
    if (albums.next) {
      setLoading(true);
      http.get<any, SearchAlbums>(albums.next).then((res) => {
        albums.next = res.albums.next;
        setAlbumItems([...albumItems, ...res.albums.items]);
        setLoading(false);
      });
    }
  }

  function loadNextTracks() {
    if (tracks.next) {
      setLoading(true);
      http.get<any, SearchTracks>(tracks.next).then((res) => {
        tracks.next = res.tracks.next;
        setTrackItems([...trackItems, ...res.tracks.items]);
        setLoading(false);
      });
    }
  }

  function loadNextArtists() {
    if (artists.next) {
      setLoading(true);
      http.get<any, SearchArtists>(artists.next).then((res) => {
        artists.next = res.artists.next;
        setArtistItems([...artistItems, ...res.artists.items]);
        setLoading(false);
      });
    }
  }

  function loadNextPlaylists() {
    if (playlists.next) {
      setLoading(true);
      http.get<any, SearchPlaylists>(playlists.next).then((res) => {
        playlists.next = res.playlists.next;
        setPlaylistItems([...playlistItems, ...res.playlists.items]);
        setLoading(false);
      });
    }
  }

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flex: 0,
        flexDirection: "column",
      }}>
      <Tabs value={value} onChange={handleChange} sx={{ mb: 2, height: 8 }}>
        <Tab label={t("title")} />
        <Tab label={t("artist")} />
        <Tab label={t("album")} />
        <Tab label={t("playlist")} />
      </Tabs>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {value === 0 && (
          <SongList
            loadMore={loadNextTracks}
            items={trackItems}
            handDoubleClick={(n) => {
              playTracks([trackItems[n].uri], 0, device?.device_id);
            }}
          />
        )}
        {value == 1 && (
          <ArtistList artists={artistItems} loadMore={loadNextArtists} />
        )}
        {value == 2 && (
          <AlbumList albums={albumItems} loadMore={loadNextAlbums} />
        )}
        {value == 3 && (
          <PlaylistList
            playlists={playlistItems}
            loadMore={loadNextPlaylists}
          />
        )}
      </Box>
      {loading && <Loading />}
    </Box>
  );
}

export default Search;
