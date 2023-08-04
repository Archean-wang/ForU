import axios from "axios";
import { refreshToken } from "./authentication";

const http = axios.create({
  baseURL: "https://api.spotify.com/v1",
  timeout: 10000,
  headers: { post: { "Content-Type": "application/json" } },
  // @ts-ignore
  retryTimes: 3,
});

http.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("sp_tk")}`;
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        return refreshToken().then(() => http(error.config));
      } else {
        let config = error.config;
        if (!config || !config.retryTimes) return Promise.reject(error);
        const { retryCount = 0, retryTimes, retryDelay = 300 } = config;
        config.retryCount = retryCount;
        if (retryCount >= retryTimes) {
          return Promise.reject(error);
        }
        config.retryCount++;
        const delay = new Promise((resolve) => {
          setTimeout(resolve, retryDelay);
        });
        return delay.then(() => http(config));
      }
    }
    return Promise.reject(error);
  }
);

export default http;
