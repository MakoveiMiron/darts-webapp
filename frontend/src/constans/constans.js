export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
export const token = localStorage.getItem('accessToken') || '';