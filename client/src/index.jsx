import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';   // <-- App.js ka default export
import './index.css';
import "uno.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
