import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; 
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './authcontext';
import AppRoutes from './Router'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  </StrictMode>
);
