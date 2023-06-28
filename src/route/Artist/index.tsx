import { Box, Tabs, Tab, Typography } from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";
import React, { useState } from "react";
import SongList from "../../components/SongList";
import { showTime } from "../../utils/formatter";
import { playTracks } from "../../api";
import AlbumList from "../../components/AlbumList";
import ArtistList from "../../components/ArtistList";

function Artist() {
  // @ts-ignore
  const { hotTracks, albums, relatedArtists } = useLoaderData();
  const [value, setValue] = useState(0);

  function handleChange(event: React.SyntheticEvent, newValue: number) {
    setValue(newValue);
  }

  return (
    <Box
      sx={{
        height: "100%",
      }}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="热门歌曲" />
        <Tab label="专辑" />
        <Tab label="相关艺人" />
      </Tabs>
      {value === 0 && (
        <SongList
          rowKey={(v) => v.id}
          items={hotTracks.tracks}
          handDoubleClick={(n) => {
            playTracks([hotTracks.tracks[n].uri]).then(() => {
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
              header: "专辑",
              field: "album",
              render: (v) => (
                <Typography noWrap={true} sx={{ color: "grey", fontSize: 14 }}>
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
      {value == 1 && <AlbumList albums={albums.items} />}
      {value == 2 && <ArtistList artists={relatedArtists.artists} />}
    </Box>
  );
}

export default Artist;
