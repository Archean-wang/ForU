import React from "react";
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
  getArtists,
  getPlayingQueue,
  getPlaylistInfo,
  getPlaylists,
  getTracks,
  getUserProfile,
} from "./api";
import Album from "./route/Album";
import Login from "./route/Login";
import Callback from "./route/Callback";
import ErrorPage from "./route/ErrorPage";
import Loved from "./route/Loved";

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
        const tracksRes = await getTracks();
        const userProfile = await getUserProfile();
        return {
          playlistsRes,
          albumsRes,
          artistsRes,
          tracksRes,
          userProfile,
        };
      } catch (err) {
        console.log(`Error when get user library: ${err}`);
      }
    },
    children: [
      {
        path: "/search",
        element: <Search />,
      },
      {
        index: true,
        path: "/daily",
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
        path: "/loved",
        element: <Loved />,
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
