import axios from "axios";

const client = axios.create({baseURL: import.meta.env.VITE_NOAIMS_END_POINT_API_DEV });

export default client;