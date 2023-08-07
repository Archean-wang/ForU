import axios from "axios";
import { getToken } from "./authentication";
import sleep from "./sleep";

const http = axios.create({
  baseURL: "https://api.spotify.com/v1",
  timeout: 10000,
  headers: { post: { "Content-Type": "application/json" } },
  // @ts-ignore
  retryTimes: 3,
});

http.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response) {
      let config = error.config;
      if (!config || !config.retryTimes) {
        throw new Error(error);
      }
      const { retryCount = 0, retryTimes, retryDelay = 300 } = config;
      if (retryCount >= retryTimes) {
        throw new Error(error);
      }
      config.retryCount = retryCount + 1;
      await sleep(retryDelay);
      return http(config);
    }
    throw new Error(error);
  }
);

export default http;
