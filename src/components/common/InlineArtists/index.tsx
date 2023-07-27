import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Artist } from "../../../utils/interface";

interface CurrentArtist {
  name: string;
  uri: string;
}

// show artists names separated by ','
function InlineArtists({
  artists,
  fontSize = 14,
}: {
  artists: Artist[] | undefined | CurrentArtist[];
  fontSize?: number;
}) {
  if (artists === undefined) return <Typography></Typography>;
  const ars = artists.map((ar: any) => (
    <Link
      to={`/artist/${ar.id || ar.uri.split(":")[2]}`}
      key={ar.id || ar.uri.split(":")[2]}>
      {" "}
      {ar.name}{" "}
    </Link>
  ));
  return (
    <Typography
      component={"p"}
      noWrap={true}
      sx={{
        color: "grey",
        display: "inline-flex",
        fontSize: fontSize,
        "a:not(:last-of-type)::after": { content: '","' },
      }}>
      {ars}
    </Typography>
  );
}

export { InlineArtists };
