import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
//import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Si desea comenzar a medir el rendimiento en su aplicación, pase una función
// para registrar resultados (por ejemplo: reportWebVitals(console.log))
// o enviar a un punto final de análisis. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
