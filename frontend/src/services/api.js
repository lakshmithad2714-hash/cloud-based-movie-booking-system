import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

// Movies
export const getMovies = () => API.get('/movies');
export const getMovieById = (id) => API.get(`/movies/${id}`);
export const createMovie = (data) => API.post('/movies', data);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);

// Shows
export const getShows = (movieId) => API.get(`/shows${movieId ? `?movieId=${movieId}` : ''}`);
export const getShowById = (id) => API.get(`/shows/${id}`);
export const createShow = (data) => API.post('/shows', data);
export const deleteShow = (id) => API.delete(`/shows/${id}`);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getUserBookings = (userId) => API.get(`/bookings/user/${userId}`);
export const getAllBookings = () => API.get('/bookings');

// Admin
export const getAllUsers = () => API.get('/admin/users');

export default API;
