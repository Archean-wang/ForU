import sleep from "./sleep";

const clientID = import.meta.env.VITE_CLIENT_ID;
const callbackURL = import.meta.env.VITE_CALLBACK;

function generateRandomString(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  function base64encode(string: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(string)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return base64encode(digest);
}

export async function getAuthCode() {
  let codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem("verifier", codeVerifier);

  let state = generateRandomString(16);
  let scope =
    "user-top-read ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-read-private playlist-modify-private user-follow-modify playlist-modify-public user-follow-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private";
  let auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: clientID,
    scope: scope,
    redirect_uri: callbackURL,
    state: state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });
  window.location.href =
    "https://accounts.spotify.com/authorize/?" +
    auth_query_parameters.toString();
}

export async function getAccessToken(code: string) {
  const codeVerifier = localStorage.getItem("verifier");
  const params = new URLSearchParams();
  params.append("client_id", clientID);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", callbackURL);
  params.append("code_verifier", codeVerifier!);

  let result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const res = await result.json();
  if (res.error) {
    throw new Error(`${res.error} :${res.error_description}`);
  } else {
    const { access_token, refresh_token } = res;
    localStorage.setItem("sp_tk", access_token);
    localStorage.setItem("sp_rt", refresh_token);
    localStorage.setItem("expire", String(3590000 + new Date().valueOf()));
  }
}

async function refreshToken() {
  let rt = localStorage.getItem("sp_rt");
  if (rt === null) throw Error("No refresh token found!");
  const params = new URLSearchParams();
  params.append("client_id", clientID);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", rt);
  console.log("refresh token...");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const res = await response.json();
  if (res.error) {
    throw new Error(`${res.error} :${res.error_description}`);
  } else {
    const { access_token, refresh_token } = res;
    localStorage.setItem("sp_tk", access_token);
    localStorage.setItem("sp_rt", refresh_token);
    localStorage.setItem("expire", String(3590000 + new Date().valueOf()));
  }
}

let isRefreshing = false;

export async function getToken(): Promise<string> {
  const expire = Number(localStorage.getItem("expire"));
  if (expire < new Date().valueOf()) {
    if (isRefreshing) {
      await sleep(300);
      return await getToken();
    } else {
      isRefreshing = true;
      try {
        await refreshToken();
      } finally {
        isRefreshing = false;
      }
    }
  }
  const token = localStorage.getItem("sp_tk");
  if (!token) throw new Error("Error when get token");
  return token;
}
