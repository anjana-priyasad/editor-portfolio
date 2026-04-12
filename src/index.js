import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/* Suppress the benign "ResizeObserver loop" warning from CRA's error overlay.
   This is a known browser quirk — not a real error — but CRA dev mode shows it. */
const _origError = window.onerror;
window.onerror = (msg, ...rest) => {
  if (typeof msg === 'string' && msg.includes('ResizeObserver loop')) return true;
  return _origError ? _origError(msg, ...rest) : false;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
