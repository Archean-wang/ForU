import axios from "axios";
import { getToken } from "./authentication";


const http = axios.create({
    baseURL: "https://api.spotify.com/v1",
    timeout: 10000,
    headers: { post: { "Content-Type": "application/json" } }
})

http.interceptors.request.use(async function (config) {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${localStorage.getItem("sp_tk")}`
        return config;
    }
    else {
        return config;
    }
}, function (error) {
    return Promise.reject(error)
})
export default http;