import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true
});

// Admin API Calls
export const adminBookings = () => API.get("/admin/bookings");
export const adminLogin = (data) => API.post("/admin/login", data);
// Users API Calls
export const fetchUsers = () => API.get("/user/");
export const addUsers = (data) => API.post("/user/create_user", data);

//Kit API Calls
export const fetchKits = () => API.get("/kit/");

//Booking API Calls
export const fetchBookings = () => API.get("/bookings/");
export const createBooking = (data) => API.post("/bookings/create", data);
export const deleteBooking = (data) => API.delete("/bookings/delete", {
  data:{"bookingId":data.bookingId}}); //Example call: deleteBooking({bookingId:<id>})

//Return API Calls
export const findUserBookings = (data) =>
  API.post("/returns/find-user-bookings", data);
export const getBookingsAndKit = (data) => API.get("/returns/booking-and-kits/", {
    params: {
    "bookingId" : data.bookingId
  }});
export const confirmReturn = (data) =>
  API.post("/returns/confirm-return", data);

// Export the API instance for any custom requests
export default API;

