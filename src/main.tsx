import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { Params, RouterProvider, createBrowserRouter } from "react-router-dom";
import Daily from "./route/Daily";

import {
  getAlbumInfo,
  getArtist,
  getArtistAlbums,
  getArtistTop,
  getPlaylistInfo,
  getRelatedArtist,
  getUserProfile,
  search,
} from "./api";

import React, { Suspense, lazy } from "react";

const Search = lazy(() => import("./route/Search"));
const Album = lazy(() => import("./route/Album"));
const Playing = lazy(() => import("./route/Playing"));
const Playlist = lazy(() => import("./route/Playlist"));
const Login = lazy(() => import("./route/Login"));
const Callback = lazy(() => import("./route/Callback"));
const ErrorPage = lazy(() => import("./route/ErrorPage"));
const Loves = lazy(() => import("./route/Loves"));
const Artist = lazy(() => import("./route/Artist"));
const Always = lazy(() => import("./route/Always"));
const Recent = lazy(() => import("./route/Recent"));

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
        element: (
          <Suspense fallback={<div> loading</div>}>
            <Search />
          </Suspense>
        ),
        loader: async ({ params }: { params: Params }) => {
          const searchResult = await search(params.kw as string);
          return { searchResult };
        },
      },
      {
        index: true,
        id: "daily",
        errorElement: (
          <Suspense fallback={<div> loading</div>}>
            <ErrorPage />
          </Suspense>
        ),
        element: <Daily />,
      },
      {
        path: "/playing",
        element: (
          <Suspense fallback={<div> loading</div>}>
            <Playing />
          </Suspense>
        ),
      },
      {
        path: "/playlist/:id",
        element: (
          <Suspense fallback={<div> loading</div>}>
            <Playlist />
          </Suspense>
        ),
        loader: async ({ params }: { params: Params }) => {
          const playlist = await getPlaylistInfo(params.id as string);
          return { playlist };
        },
      },
      {
        path: "/album/:id",
        element: (
          <Suspense fallback={<div> loading</div>}>
            <Album />
          </Suspense>
        ),
        loader: async ({ params }: { params: Params }) => {
          const album = await getAlbumInfo(params.id as string);
          return { album };
        },
      },
      {
        path: "/artist/:id",
        element: (
          <Suspense fallback={<div> loading</div>}>
            <Artist />
          </Suspense>
        ),
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
        element: (
          <Suspense fallback={<div> loading</div>}>
            <Loves />
          </Suspense>
        ),
      },
      {
        path: "/always",
        element: (
          <Suspense fallback={<div> loading</div>}>
            <Always />
          </Suspense>
        ),
      },
      {
        path: "/recent",
        element: (
          <Suspense fallback={<div> loading</div>}>
            <Recent />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/callback",
    element: (
      <Suspense fallback={<div> loading</div>}>
        <Callback />
      </Suspense>
    ),
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
