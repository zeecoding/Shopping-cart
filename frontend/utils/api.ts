import axios from 'axios';
import { getCookie } from 'cookies-next';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach Token to every request
API.interceptors.request.use((req) => {
  const token = getCookie('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;