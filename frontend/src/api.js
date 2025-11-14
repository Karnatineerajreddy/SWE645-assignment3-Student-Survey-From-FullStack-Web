import axios from "axios";

const api = axios.create({
  baseURL: "http://100.30.1.131:30080",   // Public EC2 IP + NodePort
});

export default api;
