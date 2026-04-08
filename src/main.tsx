import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './utils/constants';

import { RefreshProvider } from './context/RefreshContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.scss';

import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error("Failed to find root element");

createRoot(rootElement).render(
  <StrictMode>
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <BrowserRouter>
            <RefreshProvider>
              <App />
            </RefreshProvider>
          </BrowserRouter>
        </AuthProvider>
      </GoogleOAuthProvider>
    ) : (
      <AuthProvider>
        <BrowserRouter>
          <RefreshProvider>
            <App />
          </RefreshProvider>
        </BrowserRouter>
      </AuthProvider>
    )}
  </StrictMode>
);
