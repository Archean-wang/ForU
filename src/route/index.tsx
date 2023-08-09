import { Suspense, lazy } from "react";
import { Params, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Daily from "./Daily";
import {
  getAlbumInfo,
  getArtist,
  getArtistAlbums,
  getArtistTop,
  getPlaylistInfo,
  getRelatedArtist,
  search,
} from "../api";
import Loading from "../components/common/Loading";

const Search = lazy(() => import("./Search"));
const Album = lazy(() => import("./Album"));
const Playing = lazy(() => import("./Playing"));
const Playlist = lazy(() => import("./Playlist"));
const Login = lazy(() => import("./Login"));
const Callback = lazy(() => import("./Callback"));
const ErrorPage = lazy(() => import("./ErrorPage"));
const Loves = lazy(() => import("./Loves"));
const Artist = lazy(() => import("./Artist"));
const Always = lazy(() => import("./Always"));
const Recent = lazy(() => import("./Recent"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    id: "root",
    children: [
      {
        path: "/search/:kw",
        element: (
          <Suspense fallback={<Loading />}>
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
          <Suspense fallback={<Loading />}>
            <ErrorPage />
          </Suspense>
        ),
        element: <Daily />,
      },
      {
        path: "/playing",
        element: (
          <Suspense fallback={<Loading />}>
            <Playing />
          </Suspense>
        ),
      },
      {
        path: "/playlist/:id",
        element: (
          <Suspense fallback={<Loading />}>
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
          <Suspense fallback={<Loading />}>
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
          <Suspense fallback={<Loading />}>
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
          <Suspense fallback={<Loading />}>
            <Loves />
          </Suspense>
        ),
      },
      {
        path: "/always",
        element: (
          <Suspense fallback={<Loading />}>
            <Always />
          </Suspense>
        ),
      },
      {
        path: "/recent",
        element: (
          <Suspense fallback={<Loading />}>
            <Recent />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/callback",
    element: (
      <Suspense fallback={<Loading />}>
        <Callback />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
]);

export { router };
