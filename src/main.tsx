import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LocalStorageProvider } from './contexts/LocalStorageContext';
import { UserProvider } from './contexts/UserContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <LocalStorageProvider>
        <App />
      </LocalStorageProvider>
    </UserProvider>
  </StrictMode>
);