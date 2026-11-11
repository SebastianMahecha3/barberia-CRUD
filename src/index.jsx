// Punto de entrada de React: monta el componente Negocio dentro del <div id="root"> del index.html
import React from 'react';
import ReactDOM from 'react-dom/client';
import Negocio from './Negocio.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Negocio />
  </React.StrictMode>
);
