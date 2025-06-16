import axios from "axios";
import config from "./config";
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
export default axios.create({
  baseURL: `${config.api_url}/property/`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
