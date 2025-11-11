import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import { RefreshProvider } from './context/RefreshContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.scss';

import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error("Failed to find root element");

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <RefreshProvider>
          <App />
        </RefreshProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
