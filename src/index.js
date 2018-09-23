import React from 'react';
import { render } from 'react-dom';
import WebFont from 'webfontloader';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

WebFont.load({
  google: {
    families: [
      'Material Icons',
      'Roboto:400,500',
      'Open Sans:300italic,400italic,600italic,700italic,800italic,400,600,700,800,300',
    ],
  },
});

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
registerServiceWorker();
