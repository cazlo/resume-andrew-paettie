import React from 'react';
import { hydrateRoot } from 'react-dom';
import WebFont from 'webfontloader';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

import { createRoot } from 'react-dom/client';
import App from './App';

WebFont.load({
  google: {
    families: [
      'Material Icons',
      'Roboto:400,500',
      'Open Sans:300italic,400italic,600italic,700italic,800italic,400,600,700,800,300',
    ],
  },
});

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrateRoot(rootElement, app);
else createRoot(rootElement).render(app);
