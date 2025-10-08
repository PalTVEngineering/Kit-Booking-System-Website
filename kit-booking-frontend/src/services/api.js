import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Users API Calls
export const fetchUsers = () => API.get("/user/");
export const addUsers = (data) => API.post("/user/create_user", data);

//Kit API Calls
export const fetchKits = () => API.get("/kit/");

//Booking API Calls
export const fetchBookings = () => API.get("/bookings/");
export const createBooking = (data) => API.post("/bookings/create", data);

//Return API Calls
export const findUserBookings = (data) =>
  API.post("/returns/find-user-bookings", data);
export const confirmReturn = (data) =>
  API.post("/returns/confirm-return", data);

// Export the API instance for any custom requests
export default API;

