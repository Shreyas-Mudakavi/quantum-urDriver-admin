import axios from "axios";

const instance = axios.create({ baseURL: "http://3.239.229.120:5000" });

export default instance;
