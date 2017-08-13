import axios from 'axios';
const apiEndpoint = process.env.API_ENDPOINT || '';
import {browserHistory} from 'react-router'

let client;

(function () {
    client = axios.create({
        baseURL: apiEndpoint
    });

    client.interceptors.request.use(function (config) {
        if (localStorage.getItem('token')) {
            config.headers.Authorization = localStorage.getItem('token')
        }

        return config;
    });

    client.interceptors.response.use(null, function (error) {
        let response = error.response;

        if (response.status === 403) {
            localStorage.removeItem('token');
            window.location.reload();
            browserHistory.push("/");
        }

        return Promise.reject(error);
    });
})();

export default client;