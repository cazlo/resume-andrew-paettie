import { h, render } from 'preact';
import App from './App';
import MemoryRouter from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  render((
      <MemoryRouter>
        <App />
      </MemoryRouter>)
      , div);
});
