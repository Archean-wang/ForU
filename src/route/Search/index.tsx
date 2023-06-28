import { Box, Tabs, Tab, Typography } from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";
import React, { useState } from "react";
import SongList from "../../components/SongList";
import { InlineArtists } from "../../components/InlineArtists";
import { showTime } from "../../utils/formatter";
import { playTracks } from "../../api";
import AlbumList from "../../components/AlbumList";
import ArtistList from "../../components/ArtistList";
import PlaylistList from "../../components/PlaylistList";

function Search() {
  // @ts-ignore
  const { searchResult } = useLoaderData();
  const [value, setValue] = useState(0);

  console.log(searchResult);

  function handleChange(event: React.SyntheticEvent, newValue: number) {
    setValue(newValue);
  }

  console.log(searchResult);
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
            rowKey={(v) => v.id}
            items={searchResult.tracks.items}
            handDoubleClick={(n) => {
              playTracks([searchResult.tracks.items[n].uri]).then(() => {
                console.log(``);
              });
            }}
            columns={[
              {
                header: "歌名",
                field: "name",
                render: (v) => <Typography noWrap>{v}</Typography>,
              },
              {
                header: "歌手",
                field: "artists",
                render: (v) => <InlineArtists artists={v}></InlineArtists>,
              },
              {
                header: "专辑",
                field: "album",
                render: (v) => (
                  <Typography
                    noWrap={true}
                    sx={{ color: "grey", fontSize: 14 }}>
                    <Link to={`/album/${v.id}`}>{v.name}</Link>
                  </Typography>
                ),
              },
              {
                header: "时长",
                field: "duration_ms",
                render: (v) => (
                  <Typography
                    noWrap={true}
                    width={80}
                    sx={{
                      color: "grey",
                    }}>
                    {showTime(v)}
                  </Typography>
                ),
              },
            ]}
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
