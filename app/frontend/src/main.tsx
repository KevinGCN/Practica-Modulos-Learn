/** Router + layout global */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorSesion } from './components/SesionContext.js';
import { RequiereAuth } from './components/RequiereAuth.js';
import Autenticacion from './pages/Autenticacion.js';
import Inicio from './pages/Inicio.js';
import PanelAdmin from './pages/PanelAdmin.js';
import './estilos.css';

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorSesion>
        <Routes>
          <Route path="/login" element={<Autenticacion />} />
          <Route path="/" element={<RequiereAuth><Inicio /></RequiereAuth>} />
          <Route path="/admin" element={<RequiereAuth soloAdmin><PanelAdmin /></RequiereAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProveedorSesion>
    </BrowserRouter>
  </StrictMode>
);
