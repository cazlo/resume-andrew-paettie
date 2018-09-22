import React from 'react';
import { render } from 'react-snapshot';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
registerServiceWorker();
