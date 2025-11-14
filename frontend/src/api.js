import axios from "axios";

const api = axios.create({
  baseURL: "http://survey-backend:8000",     // internal DNS service name
});

export default api;
