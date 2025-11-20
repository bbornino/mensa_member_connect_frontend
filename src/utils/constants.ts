// src/utils/constants.ts
export const APP_NAME = 'Network of American Mensa Member Experts';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';
export const TOKEN_REFRESH_API_URL = `${API_BASE_URL}token/refresh/`;
export const PASSWORD_RESET_API_URL = `${API_BASE_URL}users/password-reset-request/`;
export const MAX_LOGIN_ATTEMPTS = 5;

// Available placeholder images
const PLACEHOLDER_IMAGES = [
  '/test-photos/meeple.png',
  '/test-photos/meeple2.png',
  '/test-photos/meeple3.png',
  '/test-photos/meeple4.png'
];

/**
 * Returns a random placeholder image from the available meeple images
 * @returns A random placeholder image path
 */
export const getRandomPlaceholderImage = (): string => {
  const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
  return PLACEHOLDER_IMAGES[randomIndex];
};
