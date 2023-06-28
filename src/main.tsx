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
  getAlbums,
  getArtistAlbums,
  getArtistTop,
  getArtists,
  getPlayingQueue,
  getPlaylistInfo,
  getPlaylists,
  getRelatedArtist,
  getTracks,
  getUserProfile,
  search,
} from "./api";
import Album from "./route/Album";
import Login from "./route/Login";
import Callback from "./route/Callback";
import ErrorPage from "./route/ErrorPage";
import Loved from "./route/Loved";
import Artist from "./route/Artist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: async () => {
      try {
        const playlistsRes = await getPlaylists();
        const albumsRes = await getAlbums();
        const artistsRes = await getArtists();
        const userProfile = await getUserProfile();
        return {
          playlistsRes,
          albumsRes,
          artistsRes,
          userProfile,
        };
      } catch (err) {
        console.log(`Error when get user library: ${err}`);
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
          return { hotTracks, albums, relatedArtists };
        },
      },
      {
        path: "/loved",
        element: <Loved />,
        loader: async () => {
          const tracksRes = await getTracks();
          return { tracksRes };
        },
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
