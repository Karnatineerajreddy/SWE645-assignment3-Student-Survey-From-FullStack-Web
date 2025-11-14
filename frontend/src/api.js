import axios from "axios";

const API = axios.create({
  baseURL: "http://100.30.1.131:8000",  // your LoadBalancer IP
});

export default API;
