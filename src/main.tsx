import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { Params, RouterProvider, createBrowserRouter } from "react-router-dom";
import Search from "./route/Search";
import Daily from "./route/Daily";
import Playing from "./route/Playing";
import Playlist from "./route/Playlist";
import {
  getAlbumInfo,
  getArtist,
  getArtistAlbums,
  getArtistTop,
  getPlayingQueue,
  getPlaylistInfo,
  getRelatedArtist,
  getUserProfile,
  search,
} from "./api";
import Album from "./route/Album";
import Login from "./route/Login";
import Callback from "./route/Callback";
import ErrorPage from "./route/ErrorPage";
import Loves from "./route/Loves";
import Artist from "./route/Artist";
import Always from "./route/Always";
import Recent from "./route/Recent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: async () => {
      try {
        const userProfile = await getUserProfile();
        return { userProfile };
      } catch (err) {
        console.error(`Error when get user library: ${err}`);
        return null;
      }
    },
    children: [
      {
        path: "/search/:kw",
        element: <Search />,
        loader: async ({ params }: { params: Params }) => {
          const searchResult = await search(params.kw as string);
          return { searchResult };
        },
      },
      {
        index: true,
        id: "daily",
        element: <Daily />,
      },
      {
        path: "/playing",
        element: <Playing />,
        loader: async () => {
          const playingList = await getPlayingQueue();
          return { playingList };
        },
      },
      {
        path: "/playlist/:id",
        element: <Playlist />,
        loader: async ({ params }: { params: Params }) => {
          const playlist = await getPlaylistInfo(params.id as string);
          return { playlist };
        },
      },
      {
        path: "/album/:id",
        element: <Album />,
        loader: async ({ params }: { params: Params }) => {
          const album = await getAlbumInfo(params.id as string);
          return { album };
        },
      },
      {
        path: "/artist/:id",
        element: <Artist />,
        loader: async ({ params }: { params: Params }) => {
          const albums = await getArtistAlbums(params.id as string);
          const hotTracks = await getArtistTop(params.id as string);
          const relatedArtists = await getRelatedArtist(params.id as string);
          const artistInfo = await getArtist(params.id as string);
          return { hotTracks, albums, relatedArtists, artistInfo };
        },
      },
      {
        path: "/loves",
        element: <Loves />,
      },
      {
        path: "/always",
        element: <Always />,
      },
      {
        path: "/recent",
        element: <Recent />,
      },
    ],
  },
  {
    path: "/callback",
    element: <Callback />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>

  <RouterProvider router={router} />

  // </React.StrictMode>
);
