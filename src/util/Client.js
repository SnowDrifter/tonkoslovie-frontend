import axios from "axios";
import history from "./History";

const apiEndpoint = process.env.API_ENDPOINT || "";

const client = axios.create({
    baseURL: apiEndpoint
});

client.interceptors.request.use(function (config) {
    if (localStorage.getItem("token")) {
        config.headers.Authorization = localStorage.getItem("token")
    }

    return config;
});

client.interceptors.response.use(null, function (error) {
    if (!error.status && !error.response) {
        history.push("/not_available");
    } else if (error.response.status === 403) {
        history.push("/access_denied");
    }

    return Promise.reject(error);
});

export default client;