// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://100.30.1.131:30080",  // NodePort backend
});

export default API;
