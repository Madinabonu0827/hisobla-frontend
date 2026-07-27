import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.message);
    return Promise.reject(err);
  }
);

export const apiClient = {
  get: <T = any>(url: string) => api.get(url).then(r => r.data) as Promise<T>,
  post: <T = any>(url: string, data?: any) => api.post(url, data).then(r => r.data) as Promise<T>,
  put: <T = any>(url: string, data?: any) => api.put(url, data).then(r => r.data) as Promise<T>,
  patch: <T = any>(url: string, data?: any) => api.patch(url, data).then(r => r.data) as Promise<T>,
  delete: <T = any>(url: string) => api.delete(url).then(r => r.data) as Promise<T>,
};

export default apiClient;
