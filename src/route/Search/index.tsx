import { Box, Tabs, Tab } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import React, { useState } from "react";
import SongList from "../../components/SongList";
import { playTracks } from "../../api";
import AlbumList from "../../components/AlbumList";
import ArtistList from "../../components/ArtistList";
import PlaylistList from "../../components/PlaylistList";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

function Search() {
  // @ts-ignore
  const { searchResult } = useLoaderData();
  const [value, setValue] = useState(0);
  const device = usePlayerDevice();

  function handleChange(event: React.SyntheticEvent, newValue: number) {
    setValue(newValue);
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
        <Tab label="歌曲" />
        <Tab label="歌手" />
        <Tab label="专辑" />
        <Tab label="歌单" />
      </Tabs>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {value === 0 && (
          <SongList
            items={searchResult.tracks.items}
            handDoubleClick={(n) => {
              playTracks(
                [searchResult.tracks.items[n].uri],
                0,
                device?.device_id
              );
            }}
          />
        )}
        {value == 1 && <ArtistList artists={searchResult.artists.items} />}
        {value == 2 && <AlbumList albums={searchResult.albums.items} />}
        {value == 3 && (
          <PlaylistList playlists={searchResult.playlists.items} />
        )}
      </Box>
    </Box>
  );
}

export default Search;
