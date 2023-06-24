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
  getAlbum,
  getAlbumInfo,
  getPlayingQueue,
  getPlaylist,
  getPlaylistInfo,
} from "./api";
import Album from "./route/Album";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/search",
        element: <Search />,
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
    ],
  },
  {
    path: "/callback",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
