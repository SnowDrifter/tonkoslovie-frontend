import axios from 'axios';
const apiEndpoint = process.env.API_ENDPOINT || '';

function headersConfig() {
    if(localStorage.getItem('token')) {
        return {
            'Authorization': localStorage.getItem('token')
        }
    } else {
        return null;
    }
}

export default axios.create({
    baseURL: apiEndpoint,
    headers: headersConfig()
});