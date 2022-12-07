import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css"
import "jquery/dist/jquery.min.js";
import Popper from 'popper.js';
import "bootstrap/dist/js/bootstrap.min.js";
import {BrowserRouter} from "react-router-dom"
import AuthProvider from './components/Context/AuthContext';

ReactDOM.render(
  <>
<BrowserRouter basename='/'>
<AuthProvider>
    <App/>
    </AuthProvider>
</BrowserRouter>
  </>,
  document.getElementById('root')
);

reportWebVitals();
