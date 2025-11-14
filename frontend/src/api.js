import axios from "axios";

const api = axios.create({
  baseURL: "http://100.30.1.131:30080",  // or use env variable
});

export default api;
