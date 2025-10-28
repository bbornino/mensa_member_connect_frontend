// src/utils/constants.ts
export const APP_NAME = 'Network of American Mensa Member Experts';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/' || 'http://localhost:8003/api/';
export const TOKEN_REFRESH_API_URL = `${API_BASE_URL}token/refresh/`;
export const MAX_LOGIN_ATTEMPTS = 5;
