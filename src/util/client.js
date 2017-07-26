import axios from 'axios';
const apiEndpoint = process.env.API_ENDPOINT || '';

export default axios.create({
    baseURL: apiEndpoint
});