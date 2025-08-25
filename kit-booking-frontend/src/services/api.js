import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change this to your backend url
});

// Users API Calls
export const fetchUsers = () => API.get("/user/");
export const addUsers = (data) => API.post("/user/create_user", data);

//Kit API Calls
export const fetchKits = () => API.get("/kit/");


