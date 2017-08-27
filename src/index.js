import { h, render } from 'preact';
import  { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.css';

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>),
    document.getElementById('root'));
registerServiceWorker();
