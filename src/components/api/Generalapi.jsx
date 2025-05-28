
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
export default axios.create({
    baseURL: `https://api.meetowner.in/general/`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});